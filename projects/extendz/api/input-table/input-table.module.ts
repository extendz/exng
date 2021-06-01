import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtMoneyModule } from '../money/money.module';
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
    ExtMoneyModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // mat
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
  ],
})
export class ExtInputTableModule {}
