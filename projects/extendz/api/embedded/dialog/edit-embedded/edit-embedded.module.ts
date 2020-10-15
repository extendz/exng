import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtEditEmbeddedComponent } from './edit-embedded.component';

@NgModule({
  declarations: [ExtEditEmbeddedComponent],
  entryComponents: [ExtEditEmbeddedComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // Extendz
    ExtPipesModule,
    // Mat
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ]
})
export class ExtEditEmbeddedModule {}
