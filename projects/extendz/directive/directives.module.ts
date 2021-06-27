import { NgModule } from '@angular/core';
import { DisplayMaskDirective } from './display-mask.directive';
import { PhoneMaskDirective } from './phone-mask.directive';

/**
 *
 * @author Randika Hapugoda
 */
@NgModule({
  declarations: [PhoneMaskDirective, DisplayMaskDirective],
  exports: [PhoneMaskDirective, DisplayMaskDirective],
})
export class ExtDirectvicesModule {}
