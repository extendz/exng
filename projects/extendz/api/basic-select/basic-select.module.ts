import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExtPipesModule } from 'extendz/pipes';
import { AddBasicModule } from './add-basic/add-basic.module';
import { ExtBasicSelectComponent } from './basic-select.component';

@NgModule({
  declarations: [ExtBasicSelectComponent],
  exports: [ExtBasicSelectComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    // Extendz
    ExtPipesModule,
    AddBasicModule,
    // Mat
    MatAutocompleteModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
})
export class ExtBasicSelectModule {}
