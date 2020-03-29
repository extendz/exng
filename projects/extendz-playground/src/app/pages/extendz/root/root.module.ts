import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtRootModule } from 'extendz/api';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    RootRoutingModule, //
    ExtRootModule
  ]
})
export class RootModule {}
