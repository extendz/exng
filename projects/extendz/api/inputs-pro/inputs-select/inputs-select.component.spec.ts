import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsSelectComponent } from './inputs-select.component';

describe('InputsSelectComponent', () => {
  let component: InputsSelectComponent;
  let fixture: ComponentFixture<InputsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputsSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
