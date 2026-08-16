import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import axios, { AxiosProgressEvent } from 'axios';
import { UrlResponse } from '../../../Types/url-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../services/snackbar-service';
import { UpdateDataService } from '../../../services/update-data-service';


@Component({
  selector: 'app-voice-recorder',
  imports: [],
  templateUrl: './voice-recorder.html',
  styleUrl: './voice-recorder.css',
})
export class VoiceRecorder {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  file: File | null = null
  showUpload = signal(false)
  uploading = signal(false)
  uploadPercentage = signal(0)
  private snackBarService = inject(SnackbarService)
  private updateDataService = inject(UpdateDataService)

  async uploadFile() {
    if (this.file === null) return
    try {
      this.uploadPercentage.set(0)
      this.uploading.set(true)
      // get the presigned URL to upload the file
      const urlRes = await axios.get<UrlResponse>(`${import.meta.env.NG_APP_API_URL}/api/Audio/url`, {
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
        ObjectKey: urlRes.data.key
      })
      this.snackBarService.openSnackbar("File uploaded 🎉", "green", 3000)
      // trigger other components to reload data
      this.updateDataService.addEntry.update(curr => !curr)

    } catch (error) {
      console.log(error)
      // Alert user to error
      let errorMsg = "File could not be uploaded"
      if (axios.isAxiosError(error) || error instanceof Error) {
        errorMsg + `:\n${error.message}`
      }
      this.snackBarService.openSnackbar(errorMsg, "red", 3000)
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
  onFileSelected(event: Event) {
    event.preventDefault()
    const input = event.target as HTMLInputElement
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
