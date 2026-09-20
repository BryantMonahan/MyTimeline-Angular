import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioBlobSubject = new Subject<Blob>();
  recordingState = signal<RecordingState>("inactive")
  audioBlob$: Observable<Blob> = this.audioBlobSubject.asObservable();

  async startRecording() {
    this.audioChunks = []

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(audioStream)

      // when new blob chunks become available, push them to our array
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) this.audioChunks.push(event.data)
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
        this.audioBlobSubject.next(audioBlob)
        audioStream.getTracks().forEach(track => track.stop())
      }

      this.mediaRecorder.start()
      this.recordingState.set("recording")
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      this.recordingState.set("paused")
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      this.recordingState.set("recording")
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
      this.recordingState.set("inactive")
    }
  }
}
