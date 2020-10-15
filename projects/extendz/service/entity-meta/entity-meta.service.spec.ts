import { TestBed } from '@angular/core/testing';
import { EntityMetaService } from './entity-meta.service';

describe('EntityMetaService', () => {
  let service: EntityMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
