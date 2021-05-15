import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ExtSimpleEntityModule } from '../../core/simple-entity/simple-entity.module';
import { ExtEditEmbeddedComponent } from './edit-embedded.component';

@NgModule({
  declarations: [ExtEditEmbeddedComponent],
  entryComponents: [ExtEditEmbeddedComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // Extendz
    ExtSimpleEntityModule,
    // Mat
    MatDialogModule,
    MatButtonModule,
  ],
})
export class ExtEditEmbeddedModule {}
