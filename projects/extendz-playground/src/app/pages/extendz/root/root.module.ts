import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtRootModule } from 'extendz/api';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    RootRoutingModule, //
    ExtRootModule,
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class RootModule {}
