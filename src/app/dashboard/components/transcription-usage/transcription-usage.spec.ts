import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptionUsage } from './transcription-usage';

describe('TranscriptionUsage', () => {
  let component: TranscriptionUsage;
  let fixture: ComponentFixture<TranscriptionUsage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptionUsage],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptionUsage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
