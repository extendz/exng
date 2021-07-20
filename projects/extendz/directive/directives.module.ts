import { NgModule } from '@angular/core';
import { DisplayMaskDirective } from './display-mask.directive';
import { HideDirective } from './hide.directive';
import { PhoneMaskDirective } from './phone-mask.directive';
import { DynamicGetDirective } from './dynamic-get/dynamic-get.directive';

/**
 *
 * @author Randika Hapugoda
 */
@NgModule({
  declarations: [PhoneMaskDirective, DisplayMaskDirective, HideDirective, DynamicGetDirective],
  exports: [PhoneMaskDirective, DisplayMaskDirective, HideDirective, DynamicGetDirective],
})
export class ExtDirectvicesModule {}
