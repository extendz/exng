import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ExtEditEmbeddedComponent } from './edit-embedded.component';
import { ExtSimpleModule } from '../../../entity/views/simple/simple.module';

@NgModule({
  declarations: [ExtEditEmbeddedComponent],
  entryComponents: [ExtEditEmbeddedComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    // Extendz
    ExtSimpleModule,
    // Mat
    MatDialogModule,
    MatButtonModule,
  ],
})
export class ExtEditEmbeddedModule {}
