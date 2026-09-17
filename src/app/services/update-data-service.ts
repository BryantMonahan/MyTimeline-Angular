import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateDataService {
  updateEntriesVar = signal(false)

  updateEntries() {
    this.updateEntriesVar.update(curr => !curr)
  }
}
