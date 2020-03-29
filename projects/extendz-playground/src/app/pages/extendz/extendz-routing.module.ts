import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./root/root.module').then(m => m.RootModule)
  },
  {
    path: ':model',
    loadChildren: () => import('./data-table/data-table.module').then(m => m.DataTableModule)
  },
  {
    path: ':model/:id',
    loadChildren: () => import('./entity/entity.module').then(m => m.EntityModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtendzRoutingModule {}
