import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperDialogComponent } from './image-cropper-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [ImageCropperDialogComponent],
  entryComponents: [ImageCropperDialogComponent],
  imports: [
    CommonModule, //
    FlexLayoutModule,
    ImageCropperModule,
    //
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
})
export class ImageCropperDialogModule {}
