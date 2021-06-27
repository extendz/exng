import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsDetailsComponent } from './docs-details.component';

describe('DocsDetailsComponent', () => {
  let component: DocsDetailsComponent;
  let fixture: ComponentFixture<DocsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
