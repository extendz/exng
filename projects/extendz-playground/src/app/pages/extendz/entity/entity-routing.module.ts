import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityComponentResolverService } from './entity-component-resolver.service';
import { EntityComponent } from './entity.component';

const routes: Routes = [
  { path: '', component: EntityComponent, resolve: { extendz: EntityComponentResolverService } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntityRoutingModule {}
