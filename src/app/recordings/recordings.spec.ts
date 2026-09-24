import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recordings } from './recordings';

describe('Recordings', () => {
  let component: Recordings;
  let fixture: ComponentFixture<Recordings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recordings],
    }).compileComponents();

    fixture = TestBed.createComponent(Recordings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
