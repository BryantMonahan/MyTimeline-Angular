import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-weekly-streak',
  imports: [],
  templateUrl: './weekly-streak.html',
  styleUrl: './weekly-streak.css',
})
export class WeeklyStreak implements OnInit {
  async ngOnInit() {
    const weeklyStreakRes = await axios.get(`${import.meta.env.NG_APP_API_URL}/api/Stats/days-this-week`, {
      params: {
        TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    })
    console.log(weeklyStreakRes)
  }
}
