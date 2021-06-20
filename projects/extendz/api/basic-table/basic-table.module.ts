import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ExtPipesModule } from 'extendz/pipes';
import { BasicTableComponent } from './basic-table.component';

@NgModule({
  declarations: [BasicTableComponent],
  exports: [BasicTableComponent],
  imports: [
    CommonModule,
    //
    ExtPipesModule,
    //
    MatTableModule,
  ],
})
export class ExtBasicTableModule {}
