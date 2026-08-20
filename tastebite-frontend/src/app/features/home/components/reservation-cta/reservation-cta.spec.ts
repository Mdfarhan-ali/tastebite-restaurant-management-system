import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCta } from './reservation-cta';

describe('ReservationCta', () => {
  let component: ReservationCta;
  let fixture: ComponentFixture<ReservationCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCta],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationCta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
