import { NgModule } from '@angular/core';
import { DisplayMaskDirective } from './display-mask.directive';
import { HideDirective } from './hide.directive';
import { PhoneMaskDirective } from './phone-mask.directive';

/**
 *
 * @author Randika Hapugoda
 */
@NgModule({
  declarations: [PhoneMaskDirective, DisplayMaskDirective, HideDirective],
  exports: [PhoneMaskDirective, DisplayMaskDirective, HideDirective],
})
export class ExtDirectvicesModule {}
