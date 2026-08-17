import { Component, effect, inject, OnInit, signal } from '@angular/core';
import axios from 'axios';
import { JournalEntry } from '../../../Types/journal-entry';
import { UpdateDataService } from '../../../services/update-data-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-recent-entries',
  imports: [DatePipe],
  templateUrl: './recent-entries.html',
  styleUrl: './recent-entries.css',
})
export class RecentEntries implements OnInit {
  entries = signal<JournalEntry[]>([])
  private updateDataService = inject(UpdateDataService)
  updateData = effect(async () => {
    this.updateDataService.addEntry()
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
  }

  playAudio(id: string) {

  }

  download(id: string) {

  }

  delete(id: string) {

  }
}
