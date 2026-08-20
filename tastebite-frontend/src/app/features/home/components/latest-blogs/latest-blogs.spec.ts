import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestBlogs } from './latest-blogs';

describe('LatestBlogs', () => {
  let component: LatestBlogs;
  let fixture: ComponentFixture<LatestBlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestBlogs],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestBlogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
