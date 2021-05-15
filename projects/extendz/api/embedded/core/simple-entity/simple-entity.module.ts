import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExtPipesModule } from 'extendz/pipes';
import { SimpleEntityComponent } from './simple-entity.component';

@NgModule({
  declarations: [SimpleEntityComponent],
  exports: [SimpleEntityComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExtPipesModule,
    FlexLayoutModule,

    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
})
export class ExtSimpleEntityModule {}
