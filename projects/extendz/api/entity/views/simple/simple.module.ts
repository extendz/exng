import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ExtInputsModule } from '../../../inputs/inputs.module';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtBasicSelectModule } from '../../../basic-select/basic-select.module';
import { ExtMoneyModule } from '../../../money/money.module';
import { ExtPhoneModule } from '../../../phone/phone.module';
import { SimpleComponent } from './simple.component';

@NgModule({
  declarations: [SimpleComponent],
  exports: [SimpleComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ExtPipesModule,
    ExtMoneyModule,
    ExtPhoneModule,
    ExtBasicSelectModule,
    ExtInputsModule,
    ReactiveFormsModule,
    //
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
})
export class ExtSimpleModule {}
