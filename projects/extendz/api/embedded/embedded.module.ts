import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtEditEmbeddedModule } from './dialog/edit-embedded/edit-embedded.module';
import { ExtTableEmbeddedModule } from './dialog/table-embedded/table-embedded.module';
import { ExtEmbeddedComponent } from './embedded.component';

@NgModule({
  declarations: [ExtEmbeddedComponent],
  exports: [ExtEmbeddedComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    // Extendz
    ExtPipesModule,
    ExtEditEmbeddedModule,
    ExtTableEmbeddedModule,
    //Mat
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
})
export class ExtEmbeddedModule {}
