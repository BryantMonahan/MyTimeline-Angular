import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import axios, { AxiosProgressEvent } from 'axios';
import { UrlResponse } from '../../../Types/url-response';
import { AlertService } from '../../../services/alert-service';
import { UpdateDataService } from '../../../services/update-data-service';
import { AudioRecordingService } from '../../../services/audio-recording-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'


@Component({
  selector: 'app-voice-recorder',
  imports: [],
  templateUrl: './voice-recorder.html',
  styleUrl: './voice-recorder.css',
})
export class VoiceRecorder implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  @ViewChild('autoTranscribe') autoTranscribe!: ElementRef<HTMLInputElement>
  file: File | null = null
  showUpload = signal(false)
  uploading = signal(false)
  recordingState = signal<RecordingState>('inactive')
  formattedTime = signal("00:00")
  uploadPercentage = signal(0)
  private alertService = inject(AlertService)
  private updateDataService = inject(UpdateDataService)
  private audioRecordingService = inject(AudioRecordingService)
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.audioRecordingService.audioBlob$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(blob => this.finishRecording(blob))
    this.recordingState = this.audioRecordingService.recordingState
  }

  startRecording() {
    this.audioRecordingService.startRecording()
  }

  pauseRecording() {
    this.audioRecordingService.pauseRecording()
  }

  resumeRecording() {
    this.audioRecordingService.resumeRecording()
  }

  stopRecording() {
    this.audioRecordingService.stopRecording()
  }

  async finishRecording(blob: Blob) {
    console.log("finished Recording")
    const file = new File([blob], Date.now().toString() + `.${blob.type.replace('audio/', '')}`, {
      type: blob.type,
      lastModified: Date.now()
    })
    console.log(file)

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    if (this.fileInput) {
      this.fileInput.nativeElement.files = dataTransfer.files
      this.onFileSelected()
    }
  }

  async uploadFile() {
    if (this.file === null) return
    let transcribe = false
    try {
      if (this.autoTranscribe && this.autoTranscribe.nativeElement.checked.valueOf()) {
        const res = await axios.get<{ transcriptionsLeft: number }>(`${import.meta.env.NG_APP_API_URL}/api/Stats/transcriptions-left`)
        if (res.data.transcriptionsLeft === 0) {
          this.alertService.openSnackbar("You are out of free transcriptions", "red", 2000)
        } else if (res.data.transcriptionsLeft !== -1) {
          const cont = await this.alertService.openAlert(`You only have ${res.data.transcriptionsLeft} transcripts left. Do you want to continue?`)
          if (!cont) return
          transcribe = true
        } else {
          transcribe = true
        }
      }
      this.uploadPercentage.set(0)
      this.uploading.set(true)
      // get the presigned URL to upload the file
      const urlRes = await axios.get<UrlResponse>(`${import.meta.env.NG_APP_API_URL}/api/Audio/post-url`, {
        params: { fileName: this.file.name }
      })

      // upload file to S3 bucket
      try {
        await axios.put(urlRes.data.url, this.file, {
          headers: { 'Content-Type': this.file.type },
          ...this.progressConfig
        })
      } catch (error) {
        console.log(error)
        // throw our own error to prevent AWS error messages from being displayed
        throw new Error("File could not be uploaded")
      }

      // check that the file was uploaded
      await axios.post(`${import.meta.env.NG_APP_API_URL}/api/Audio/confirm-upload`, {
        ObjectKey: urlRes.data.key,
        Transcribe: transcribe
      })
      this.alertService.openSnackbar("File uploaded 🎉", "green", 3000)
      // trigger other components to reload data
      this.updateDataService.updateEntries()

    } catch (error) {
      console.log(error)
      // Alert user to error
      let errorMsg = "File could not be uploaded"
      if (axios.isAxiosError(error) || error instanceof Error) {
        errorMsg + `:\n${error.message}`
      }
      this.alertService.openSnackbar(errorMsg, "red", 3000)
    } finally {
      // reset the upload fields
      this.uploading.set(false)
      this.showUpload.set(false)
      this.file = null
      this.fileInput.nativeElement.value = ''
    }
  }


  /**
   * Set our file var to the file uploaded or reset var if not file was given
   * @param event File change event
   */
  onFileSelected(event?: Event) {
    if (event) event.preventDefault()
    const input = this.fileInput.nativeElement
    if (input.files && input.files.length > 0) {
      this.file = input.files[0]
      this.showUpload.set(true)
    } else {
      this.file = null
      this.showUpload.set(false)
    }
  }

  // pass to axios to update the upload progress %
  progressConfig = {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      const { loaded, total } = progressEvent;

      if (total) {
        const percentage = Math.round((loaded * 100) / total)
        this.uploadPercentage.set(percentage)
      }
    }
  }
}
