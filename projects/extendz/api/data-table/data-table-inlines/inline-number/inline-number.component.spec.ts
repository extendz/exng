import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineNumberComponent } from './inline-number.component';

describe('InlineNumberComponent', () => {
  let component: InlineNumberComponent;
  let fixture: ComponentFixture<InlineNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlineNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
