import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileProperty, ImageCroppedPropertyEvent, Property, RelationshipType } from 'extendz/core';
import { take } from 'rxjs/operators';
import { ImageCropperDialogComponent } from './image-cropper-dialog/image-cropper-dialog.component';

@Component({
  selector: 'ext-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ExtImageComponent implements OnInit {
  @Input() public property: Property;

  @Input() public entity: any;

  @Output() public add: EventEmitter<FileProperty> = new EventEmitter<FileProperty>();

  public displayImages: SafeUrl[] = [];
  public multiple: boolean;

  constructor(private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Show existing images
    if (this.entity) {
      let name = this.property.name;
      if (this.property.relationshipType === RelationshipType.oneToMany) {
        let urls = this.entity[name] as string[];
        if (urls)
          this.displayImages = urls.map((path) =>
            this.sanitizer.bypassSecurityTrustStyle(`url(${path})`)
          );
      } else {
        let url = this.entity[name] as string;
        if (url) this.displayImages = [this.sanitizer.bypassSecurityTrustStyle(`url(${url})`)];
      }
    }
    this.multiple = this.property.relationshipType === RelationshipType.oneToMany;
  } //ngOnInit()

  public handleFile(data: FileProperty) {
    let im = this.property.imageMeta;
    if (im && im.cropper) {
      data.property = this.property;
      const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
        minWidth: '100vw',
        maxHeight: '100vh',
        disableClose: false,
        panelClass: 'image-cropper-dialog',
        data,
      });
      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((e: ImageCroppedPropertyEvent) => {
          console.log(e);
          this.handleFileRead(<File>e.file);
          this.add.emit({ file: e.file, property: this.property });
        });
    } else {
      let eventObj: MSInputMethodContext = <MSInputMethodContext>(<unknown>event);
      let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
      for (let index = 0; index < target.files.length; index++) {
        let file = target.files[index];
        this.handleFileRead(file);
        this.add.emit({ file, property: this.property });
      }
    }
  } // handleFile()

  private handleFileRead(file: File) {
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      let path = <string>reader.result;
      let image = this.sanitizer.bypassSecurityTrustStyle(`url(${path})`);
      if (this.property.relationshipType == RelationshipType.oneToMany)
        this.displayImages.unshift(image);
      else {
        this.displayImages[0] = image;
      }
    };
    reader.readAsDataURL(file);
  } // handleFileRead()
}
