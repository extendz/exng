import { NgModule } from '@angular/core';
import { CamelCasePipe } from './camel-case.pipe';
import { MoneyPipe } from './money.pipe';

const declarations = [CamelCasePipe, MoneyPipe];

/**
 *
 * @author Randika Hapugoda
 */
@NgModule({
  declarations,
  exports: declarations,
})
export class ExtPipesModule {}
