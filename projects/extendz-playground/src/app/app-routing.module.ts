import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'api',
    loadChildren: () => import('./pages/extendz/extendz.module').then((m) => m.ExtendzModule),
  },
  { path: '', loadChildren: () => import('./pages/docs/docs.module').then((m) => m.DocsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
