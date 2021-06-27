import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsDetailsComponent } from './docs-details.component';

const routes: Routes = [{ path: '', component: DocsDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsDetailsRoutingModule { }
