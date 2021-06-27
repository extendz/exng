import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocsDetailsRoutingModule } from './docs-details-routing.module';
import { DocsDetailsComponent } from './docs-details.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [DocsDetailsComponent],
  imports: [
    CommonModule,
    DocsDetailsRoutingModule,
    //
    MatTabsModule
  ]
})
export class DocsDetailsModule { }
