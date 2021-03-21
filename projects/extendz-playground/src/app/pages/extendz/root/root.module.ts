import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtRootModule } from 'extendz/api';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    RootRoutingModule,
    ExtRootModule.forFeature({
      svgIconSet: 'assets/svg/api-icons.svg',
      modelsJson: 'assets/json/models.json',
    }),
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class RootModule {}
