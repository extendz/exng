import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExtPipesModule } from 'extendz/pipes';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [RootComponent],
  exports: [RootComponent],
  imports: [
    CommonModule,
    // Ext
    ExtPipesModule,
    FlexLayoutModule,
    // Material
    MatCardModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule
  ]
})
export class ExtRootModule {}
