import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtSelectModule } from '../select/select.module';
import { InputsSelectComponent } from './inputs-select/inputs-select.component';

@NgModule({
  declarations: [InputsSelectComponent],
  exports: [InputsSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //
    ExtPipesModule,
    ExtSelectModule,
    //
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
})
export class InputsProModule {}
