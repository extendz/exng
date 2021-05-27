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
import { ExtAddNewModule } from './dialog/add-new/add-new.module';
import { ExtAdvanceSelectModule } from './dialog/advance-select/advance-select.module';
import { ExtSelectComponent } from './select.component';

@NgModule({
  declarations: [ExtSelectComponent],
  exports: [ExtSelectComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    // Extendz
    ExtPipesModule,
    ExtAdvanceSelectModule,
    ExtAddNewModule,
    //Mat
    MatAutocompleteModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
})
export class ExtSelectModule {}
