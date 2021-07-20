import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExtDirectvicesModule } from 'extendz/directive';
import { InlineDateComponent } from './inline-date/inline-date.component';
import { InlineNumberComponent } from './inline-number/inline-number.component';

@NgModule({
  declarations: [InlineDateComponent, InlineNumberComponent],
  exports: [InlineDateComponent, InlineNumberComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // Ext
    ExtDirectvicesModule,
    // CDK
    OverlayModule,
    //
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class ExtDataTableInlinesModule {}
