import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtBasicComponent } from './basic.component';

describe('BasicComponent', () => {
  let component: ExtBasicComponent;
  let fixture: ComponentFixture<ExtBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
