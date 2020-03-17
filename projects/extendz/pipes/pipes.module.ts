import { NgModule } from '@angular/core';
import { CamelCasePipe } from './camel-case.pipe';
/**
 *
 * @author Randika Hapugoda
 */
@NgModule({
  declarations: [CamelCasePipe],
  exports: [CamelCasePipe]
})
export class ExtPipesModule {}
