import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtDataTableAddComponent } from './data-table-add.component';

describe('DataTableAddComponent', () => {
  let component: ExtDataTableAddComponent;
  let fixture: ComponentFixture<ExtDataTableAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtDataTableAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtDataTableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
