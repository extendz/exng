import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineDateComponent } from './inline-date.component';

describe('InlineDateComponent', () => {
  let component: InlineDateComponent;
  let fixture: ComponentFixture<InlineDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlineDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
