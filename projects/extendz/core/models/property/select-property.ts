import { Property } from '../property';

export class SelectProperty extends Property {
  /*** Refence for object  */
  reference?: string;
  showAdd?: boolean;
  addIcon?: string;

  showSearch?: boolean;
  seachIcons?: string;

  showMore?: boolean;
  moreIcon?: string;
}
