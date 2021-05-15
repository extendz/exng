import { Href } from "./href";

export class Links {
  first?: Href;
  self?: Href;
  next?: Href;
  last?: Href;
  profile?: Href;
  search?: Href;
  [key: string]: any;
}
