import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTableComponent } from './data-table.component';

const routes: Routes = [
  {
    path: '',
    component: DataTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataTableRoutingModule {}
