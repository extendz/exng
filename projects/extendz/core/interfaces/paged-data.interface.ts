import { PageEvent } from '@angular/material/paginator';

export interface PagedData {
  data: any[];
  page?: PageEvent;
}
