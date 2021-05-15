import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleEntityComponent } from './simple-entity.component';

describe('SimpleEntityComponent', () => {
  let component: SimpleEntityComponent;
  let fixture: ComponentFixture<SimpleEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
