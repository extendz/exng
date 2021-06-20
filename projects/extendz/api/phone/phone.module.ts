import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExtDirectvicesModule } from 'extendz/directive';
import { ExtPipesModule } from 'extendz/pipes';
import { PhoneComponent } from './phone.component';

@NgModule({
  declarations: [PhoneComponent],
  exports: [PhoneComponent],
  imports: [
    CommonModule,
    ExtPipesModule,
    ExtDirectvicesModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class ExtPhoneModule {}
