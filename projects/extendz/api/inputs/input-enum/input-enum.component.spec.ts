import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEnumComponent } from './input-enum.component';

describe('InputEnumComponent', () => {
  let component: InputEnumComponent;
  let fixture: ComponentFixture<InputEnumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputEnumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputEnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
