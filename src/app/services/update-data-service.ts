import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateDataService {
  addEntry = signal(false)
}
