import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtSelectModule } from '../select/select.module';
import { InputTableComponent } from './input-table.component';

@NgModule({
  declarations: [InputTableComponent],
  exports: [InputTableComponent],
  imports: [
    CommonModule,
    // Ext
    ExtPipesModule,
    ExtSelectModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // mat
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
  ],
})
export class ExtInputTableModule {}
