import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ExtPipesModule } from 'extendz/pipes';
import { InputStringComponent } from './input-string/input-string.component';

@NgModule({
  declarations: [InputStringComponent],
  exports: [InputStringComponent],
  imports: [CommonModule, ExtPipesModule, ReactiveFormsModule, MatInputModule],
})
export class ExtInputsModule {}
