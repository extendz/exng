import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtRootModule } from 'extendz/api';
import { ROOT_CONFIG } from '../extendz.config';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RootRoutingModule,
    ExtRootModule.forFeature(ROOT_CONFIG),
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class RootModule {}
