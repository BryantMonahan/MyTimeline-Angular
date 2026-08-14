import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import axios, { AxiosProgressEvent } from 'axios';
import { UrlResponse } from '../../../Types/url-response';

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

  async uploadFile() {
    // TODO: implement error logic
    if (this.file === null) return
    try {
      this.uploadPercentage.set(0)
      this.uploading.set(true)
      const urlRes = await axios.get<UrlResponse>(`${import.meta.env.NG_APP_API_URL}/api/Audio/url`, {
        params: { fileName: this.file.name }
      })
      console.log("got the url, now putting", urlRes)
      const uploadRes = await axios.put(urlRes.data.url, this.file, {
        headers: { 'Content-Type': this.file.type },
        ...this.progressConfig
      })
      console.log("put", uploadRes)
      const confirmRes = await axios.post(`${import.meta.env.NG_APP_API_URL}/api/Audio/confirm-upload`, {
        ObjectKey: urlRes.data.key
      })
      console.log(confirmRes)
    } catch (error) {

    } finally {
      this.uploading.set(false)
      this.showUpload.set(false)
      this.file = null
      this.fileInput.nativeElement.value = ''
    }
  }

  async confirmUpload() {
  }

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
