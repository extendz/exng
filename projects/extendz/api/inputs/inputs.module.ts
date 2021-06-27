import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExtPipesModule } from 'extendz/pipes';
import { InputEnumComponent } from './input-enum/input-enum.component';
import { InputStringComponent } from './input-string/input-string.component';

@NgModule({
  declarations: [InputStringComponent, InputEnumComponent],
  exports: [InputStringComponent, InputEnumComponent],
  imports: [CommonModule, ExtPipesModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
})
export class ExtInputsModule {}
