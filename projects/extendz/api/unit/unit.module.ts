import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExtPipesModule } from 'extendz/pipes';
import { UnitComponent } from './unit.component';

@NgModule({
  declarations: [UnitComponent],
  exports: [UnitComponent],
  imports: [
    CommonModule,
    ExtPipesModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class ExtUnitModule {}
