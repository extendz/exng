import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { InlineDateComponent } from './inline-date/inline-date.component';

@NgModule({
  declarations: [InlineDateComponent],
  exports: [InlineDateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    //
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
  ],
})
export class ExtDataTableInlinesModule {}
