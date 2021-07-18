import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintPageComponent } from './print-page.component';

const declarations = [PrintPageComponent];

@NgModule({
  declarations,
  exports: declarations,
  imports: [CommonModule],
})
export class PrintPageModule {}
