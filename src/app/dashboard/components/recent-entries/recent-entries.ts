import { AlertService } from '../../../services/alert-service';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import axios from 'axios';
import { JournalEntry } from '../../../Types/journal-entry';
import { UpdateDataService } from '../../../services/update-data-service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import { ConfirmDialog } from '../../../helpers/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-recent-entries',
  imports: [DatePipe],
  templateUrl: './recent-entries.html',
  styleUrl: './recent-entries.css',
})
export class RecentEntries implements OnInit {
  private snackbarService = inject(AlertService)
  private updateDataService = inject(UpdateDataService)
  private matDialog = inject(MatDialog)
  entries = signal<JournalEntry[]>([])
  updateData = effect(async () => {
    this.updateDataService.updateEntriesVar()
    await this.getEntries()
  })

  async ngOnInit() {
    await this.getEntries()
  }

  async getEntries() {
    // get the most recent entries that the user has made
    const recentEntriesRes = await axios.get<JournalEntry[]>(`${import.meta.env.NG_APP_API_URL}/api/Audio/most-recent-entries`, {
      params: {
        numOfEntries: 5
      }
    })
    this.entries.set(recentEntriesRes.data)
    console.log(this.entries())
  }

  playAudio(id: string) {

  }

  async download(objectKey: string, fileName: string) {
    const urlRes = await axios.get<string>(`${import.meta.env.NG_APP_API_URL}/api/Audio/get-url`, {
      params: { objectKey }
    })
    const s3Res = await axios.get(urlRes.data, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(s3Res.data)
    const link = document.createElement('a')
    link.setAttribute('download', fileName)
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async delete(id: string) {
    try {
      const confirmed = await this.confirmDelete()
      if (!confirmed) return
      const deleteEntryRes = await axios.delete(`${import.meta.env.NG_APP_API_URL}/api/Audio/delete-entry`, { headers: { ObjectKey: id } })
      this.updateDataService.updateEntries()
      this.snackbarService.openSnackbar("Entry deleted", "green", 2000)
    } catch (error) {
      console.log(error)
      this.snackbarService.openSnackbar("Something went wrong deleting the file", "red", 2000)
    }
  }

  async confirmDelete(): Promise<boolean> {
    let matRef = this.matDialog.open(ConfirmDialog, { data: { message: "Are you sure you want to delete this entry?" } })
    let result = firstValueFrom(matRef.afterClosed())
    return result ?? false
  }
}
