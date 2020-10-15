import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendzComponent } from './extendz.component';

describe('ExtendzComponent', () => {
  let component: ExtendzComponent;
  let fixture: ComponentFixture<ExtendzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
