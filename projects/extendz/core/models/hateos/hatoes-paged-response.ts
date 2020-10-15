import { HateosResponse } from './hatoes-response';
import { Page } from './page';

export class HateosPagedResponse extends HateosResponse {
  page?: Page;
}
