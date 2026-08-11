import { Component } from '@angular/core';
import axios, { AxiosProgressEvent } from 'axios';
import { UrlResponse } from '../Types/url-response';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  file: File | null = null
  showUpload = false
  uploading = false

  async uploadFile() {
    // TODO: implement error logic
    if (this.file === null) return
    try {
      const urlRes = await axios.get<UrlResponse>(`${import.meta.env.NG_APP_API_URL}/api/Audio/url`, {
        params: { fileName: this.file.name }
      })
      console.log("got the url, now putting", urlRes)
      const uploadRes = await axios.put(urlRes.data.url, this.file, {
        headers: { 'Content-Type': this.file.type },
        ...this.progressConfig
      })
      console.log("put", uploadRes)
    } catch (error) {

    } finally {
      this.uploading = false
    }
  }

  onFileSelected(event: Event) {
    event.preventDefault()
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.file = input.files[0]
      this.showUpload = true
    } else {
      this.file = null
      this.showUpload = false
    }
  }

  progressConfig = {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      const { loaded, total } = progressEvent;

      if (total) {
        const percentage = Math.round((loaded * 100) / total);
        console.log(`Upload Progress: ${percentage}%`);
      }
    }
  }
}
