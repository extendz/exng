import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ExtPipesModule } from 'extendz/pipes';
import { SelectBasicComponent } from './select-basic.component';

const declarations = [SelectBasicComponent];

@NgModule({
  declarations,
  exports: declarations,
  imports: [CommonModule, MatDialogModule, ExtPipesModule, MatButtonModule, MatTableModule],
})
export class SelectBasicModule {}
