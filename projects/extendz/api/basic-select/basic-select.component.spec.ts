import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtBasicSelectComponent } from './basic-select.component';

describe('BasicSelectComponent', () => {
  let component: ExtBasicSelectComponent;
  let fixture: ComponentFixture<ExtBasicSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtBasicSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtBasicSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
