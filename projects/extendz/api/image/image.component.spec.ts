import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtImageComponent } from './image.component';

describe('ImageComponent', () => {
  let component: ExtImageComponent;
  let fixture: ComponentFixture<ExtImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
