import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ExtPipesModule } from 'extendz/pipes';
import { MoneyComponent } from './money.component';

@NgModule({
  declarations: [MoneyComponent],
  exports: [MoneyComponent],
  imports: [
    CommonModule,
    ExtPipesModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
  ],
})
export class ExtMoneyModule {}
