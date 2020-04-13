import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedPropertyEvent, ImageMeta } from 'extendz/core';
import { base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'ext-image-cropper-dialog',
  templateUrl: './image-cropper-dialog.component.html',
  styleUrls: ['./image-cropper-dialog.component.scss'],
})
export class ImageCropperDialogComponent implements OnInit {
  public croppedImage: ImageCroppedPropertyEvent;
  public loading = true;
  public imageMeta: ImageMeta;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public imageCroppedEvent: ImageCroppedPropertyEvent
  ) {
    this.imageMeta = this.imageCroppedEvent.property.imageMeta;
    if (!this.imageMeta.ratio) this.imageMeta.ratio = 1;
    if (!this.imageMeta.resizeToWidth) this.imageMeta.resizeToWidth = 640;
    if (!this.imageMeta.format) this.imageMeta.format = 'jpeg';
  }

  ngOnInit(): void {}

  public imageCropped(event: ImageCroppedPropertyEvent) {
    this.croppedImage = event;
  }

  public imageLoaded() {}

  public cropperReady() {
    this.loading = false;
  }

  public loadImageFailed() {}

  /***
   *
   */
  public onCancel() {
    this.dialogRef.close();
  }
  /***
   * on crop
   */
  public onCrop() {
    this.croppedImage.file = base64ToFile(this.croppedImage.base64);
    this.dialogRef.close(this.croppedImage);
  }
} // class
