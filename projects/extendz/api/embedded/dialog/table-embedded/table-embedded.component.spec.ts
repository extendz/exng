import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEmbeddedComponent } from './table-embedded.component';

describe('TableEmbeddedComponent', () => {
  let component: TableEmbeddedComponent;
  let fixture: ComponentFixture<TableEmbeddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableEmbeddedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEmbeddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
