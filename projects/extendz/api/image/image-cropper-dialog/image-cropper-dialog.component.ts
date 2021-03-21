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
  // public croppedImage: ImageCroppedPropertyEvent;
  public loading = true;
  public imageMeta: ImageMeta;
  public files: FileList;
  public currentFile: File;
  public currentIndex: number;
  public map: Map<string, ImageCroppedPropertyEvent>;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public imageCroppedEvent: ImageCroppedPropertyEvent
  ) {
    this.imageMeta = this.imageCroppedEvent.property.imageMeta;
    if (!this.imageMeta.ratio) this.imageMeta.ratio = 1;
    if (!this.imageMeta.resizeToWidth) this.imageMeta.resizeToWidth = 640;
    if (!this.imageMeta.format) this.imageMeta.format = 'jpeg';

    this.files = this.imageCroppedEvent.target.files;
    this.currentIndex = 0;
    this.currentFile = this.files[this.currentIndex];
  }

  ngOnInit(): void {}

  public imageCropped(event: ImageCroppedPropertyEvent) {
    // this.croppedImage = event;
    if (!this.map) this.map = new Map();
    this.map.set(this.currentFile.name, event);
  }

  public imageLoaded() {}

  public cropperReady() {
    this.loading = false;
  }

  public loadImageFailed() {}

  public onCancel() {
    this.dialogRef.close();
  }

  onCrop() {
    const finalImageList: ImageCroppedPropertyEvent[] = [];
    this.map.forEach((v, k) => {
      const blob = base64ToFile(v.base64);
      v.file = this.blobToFile(blob, k);
      finalImageList.push(v);
    });
    this.dialogRef.close(finalImageList);
  }

  private blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  };

  onNext() {
    this.loading = true;
    if (this.currentIndex < this.files.length) this.currentFile = this.files[++this.currentIndex];
  }

  onPrevious() {
    this.loading = true;
    if (this.currentIndex >= 0) this.currentFile = this.files[--this.currentIndex];
  }
} // class
