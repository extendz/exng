import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtMoneyModule } from '../../../money/money.module';
import { SimpleComponent } from './simple.component';

@NgModule({
  declarations: [SimpleComponent],
  exports: [SimpleComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ExtPipesModule,
    ExtMoneyModule,
    MatInputModule,
    MatSelectModule,

    ReactiveFormsModule,
  ],
})
export class ExtSimpleModule {}
