import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ExtPipesModule } from 'extendz/pipes';
import { ColorComponent } from './color.component';

@NgModule({
  declarations: [ColorComponent],
  exports: [ColorComponent],
  imports: [
    CommonModule,
    ExtPipesModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
  ],
})
export class ExtColorModule {}
