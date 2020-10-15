import { PageEvent } from '@angular/material/paginator';

export interface PagedData {
  data: object[];
  page?: PageEvent;
}
