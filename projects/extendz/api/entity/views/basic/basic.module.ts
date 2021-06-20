import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtInputsModule } from '../../../inputs/inputs.module';
import { ExtMoneyModule } from '../../../money/money.module';
import { ExtBasicComponent } from './basic.component';

@NgModule({
  declarations: [ExtBasicComponent],
  exports: [ExtBasicComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ExtPipesModule,
    ExtInputsModule,
    ExtMoneyModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
})
export class ExtBasicModule {}
