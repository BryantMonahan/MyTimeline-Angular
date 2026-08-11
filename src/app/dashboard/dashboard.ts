import { Component } from '@angular/core';
import { Topbar } from './components/topbar/topbar';
import { Sidebar } from './components/sidebar/sidebar';
import { StatsRow } from './components/stats-row/stats-row';
import { VoiceRecorder } from './components/voice-recorder/voice-recorder';
import { TranscriptionUsage } from './components/transcription-usage/transcription-usage';
import { WeeklyStreak } from './components/weekly-streak/weekly-streak';
import { RecentEntries } from './components/recent-entries/recent-entries';

@Component({
  selector: 'app-dashboard',
  imports: [Topbar, Sidebar, StatsRow, VoiceRecorder, TranscriptionUsage, WeeklyStreak, RecentEntries],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
