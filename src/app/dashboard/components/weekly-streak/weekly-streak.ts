import { Component, OnInit, signal } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-weekly-streak',
  imports: [],
  templateUrl: './weekly-streak.html',
  styleUrl: './weekly-streak.css',
})
export class WeeklyStreak implements OnInit {
  private Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  days: { day: string; active: boolean }[] = []
  numOfEntriesText = signal("No entries")

  async ngOnInit() {
    const curr = new Date()
    const weeklyStreakRes = await axios.get<boolean[]>(`${import.meta.env.NG_APP_API_URL}/api/Stats/past-seven-days`, {
      params: {
        TimeSinceMidnight: curr.getHours() * 60 + curr.getMinutes()
      }
    })
    const day = new Date()
    let activeDays = 0
    for (const active of weeklyStreakRes.data) {
      if (active) activeDays++
      this.days.push({ day: this.Days[day.getDay()][0], active })
      day.setTime(day.getTime() - 86400000)
    }
    // flip it so Today is on the right
    this.days.reverse()
    this.numOfEntriesText.set(activeDays === 1 ? "1 entry" : `${activeDays} entries`)
  }
}
