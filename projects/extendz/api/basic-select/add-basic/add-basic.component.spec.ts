import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBasicComponent } from './add-basic.component';

describe('AddBasicComponent', () => {
  let component: AddBasicComponent;
  let fixture: ComponentFixture<AddBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
