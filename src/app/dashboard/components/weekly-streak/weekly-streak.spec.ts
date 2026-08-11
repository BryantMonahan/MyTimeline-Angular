import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyStreak } from './weekly-streak';

describe('WeeklyStreak', () => {
  let component: WeeklyStreak;
  let fixture: ComponentFixture<WeeklyStreak>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyStreak],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyStreak);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
