import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ExtDirectvicesModule } from 'extendz/directive';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtDataTableInlinesModule } from '../data-table/data-table-inlines/data-table-inlines.module';
import { InputsProModule } from '../inputs-pro/inputs-pro.module';
import { ExtInputsModule } from '../inputs/inputs.module';
import { ExtMoneyModule } from '../money/money.module';
import { ExtAdvanceSelectModule } from '../select/dialog/advance-select/advance-select.module';
import { ExtSelectModule } from '../select/select.module';
import { ExtToolbarModule } from '../toolbar/toolbar.module';
import { InputTableComponent } from './input-table.component';

@NgModule({
  declarations: [InputTableComponent],
  exports: [InputTableComponent],
  imports: [
    CommonModule,
    // Ext
    ExtDirectvicesModule,
    ExtPipesModule,
    ExtSelectModule,
    ExtAdvanceSelectModule,
    ExtMoneyModule,
    ExtToolbarModule,
    ExtDataTableInlinesModule,
    InputsProModule,
    ExtInputsModule,
    //
    ReactiveFormsModule,
    FlexLayoutModule,
    // mat
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
  ],
})
export class ExtInputTableModule {}
