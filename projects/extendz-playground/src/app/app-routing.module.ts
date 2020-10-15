import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/extendz/extendz.module').then(m => m.ExtendzModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
