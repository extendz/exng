import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtAdvanceSelectComponent } from './advance-select.component';

describe('AdvanceSelectComponent', () => {
  let component: ExtAdvanceSelectComponent;
  let fixture: ComponentFixture<ExtAdvanceSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtAdvanceSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtAdvanceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
