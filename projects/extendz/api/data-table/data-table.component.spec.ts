import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExtDataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  let component: ExtDataTableComponent;
  let fixture: ComponentFixture<ExtDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExtDataTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
