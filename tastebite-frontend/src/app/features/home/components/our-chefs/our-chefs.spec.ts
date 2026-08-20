import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurChefs } from './our-chefs';

describe('OurChefs', () => {
  let component: OurChefs;
  let fixture: ComponentFixture<OurChefs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurChefs],
    }).compileComponents();

    fixture = TestBed.createComponent(OurChefs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
