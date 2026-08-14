import { Component, OnInit, signal } from '@angular/core';
import axios from 'axios';
import { JournalEntry } from '../../../Types/journal-entry';

@Component({
  selector: 'app-recent-entries',
  imports: [],
  templateUrl: './recent-entries.html',
  styleUrl: './recent-entries.css',
})
export class RecentEntries implements OnInit {
  entries = signal<JournalEntry[]>([])

  async ngOnInit() {
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

  download(id: string) {

  }

  delete(id: string) {

  }
}
