import { Assert, Hidden } from '../models/config';

/***
 * @returns <b>true</b> to hide the element
 */
export function shouldHide(entity: any, hiden: Hidden): boolean {
  /*** if hidden logic is not there, then shoud be shown */
  if (hiden == null) return false;
  else if (entity == null && hiden?.emptyValue != null) return hiden.emptyValue;
  else if (entity == null) {
    /*** Entity empty means new one. */
    return true;
  }

  const value = entity[hiden.property];

  switch (hiden.assert) {
    case Assert.NotNull:
      if (value != undefined || value != null) return true;
      else return false;
    case Assert.Null:
      if (value == undefined || value == null) return true;
      else return false;
    case Assert.Equal:
      if (value == hiden.value) return true;
      else return false;
    case Assert.NotEqual:
      if (value != hiden.value) return true;
      else return false;
  }
}
