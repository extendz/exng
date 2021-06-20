import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtRootModule } from 'extendz/api';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';
import { LOCAL_ROOT_CONFIG } from './root.config';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RootRoutingModule,
    ExtRootModule.forFeature(LOCAL_ROOT_CONFIG),
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class RootModule {}
