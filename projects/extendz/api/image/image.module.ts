import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ExtPipesModule } from 'extendz/pipes';
import { ImageCropperDialogModule } from './image-cropper-dialog/image-cropper-dialog.module';
import { ExtImageComponent } from './image.component';

@NgModule({
  declarations: [ExtImageComponent],
  exports: [ExtImageComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ImageCropperDialogModule,
    // Ext
    ExtPipesModule,
    //
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class ExtImageModule {}
