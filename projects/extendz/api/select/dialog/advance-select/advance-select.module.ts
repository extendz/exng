import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ExtDataTableModule } from '../../../data-table/data-table.module';
import { ExtAdvanceSelectComponent } from './advance-select.component';

@NgModule({
  declarations: [ExtAdvanceSelectComponent],
  entryComponents: [ExtAdvanceSelectComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    // Extendz
    ExtDataTableModule,
    // Mat
    MatButtonModule,
    MatDialogModule
  ]
})
export class ExtAdvanceSelectModule {}
