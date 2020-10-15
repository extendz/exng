import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmbeddedComponent } from './edit-embedded.component';

describe('EditEmbeddedComponent', () => {
  let component: EditEmbeddedComponent;
  let fixture: ComponentFixture<EditEmbeddedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmbeddedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmbeddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
