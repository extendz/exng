import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedPropertyEvent, Property, PropertyType } from 'extendz/core';
import { take } from 'rxjs/operators';
import { ImageCropperDialogComponent } from './image-cropper-dialog/image-cropper-dialog.component';

@Component({
  selector: 'ext-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ExtImageComponent),
    },
  ],
})
export class ExtImageComponent implements ControlValueAccessor {
  @Input() property: Property;
  // @Input() entity: any;
  @Input() mini: boolean;
  @Input() multiple: boolean;

  // @Output() public add: EventEmitter<FileProperty> = new EventEmitter<FileProperty>();

  public displayImages: SafeUrl[] = [];

  constructor(private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  public onChange: any = () => {};
  public onTouched: any = () => {};

  writeValue(urls: string | string[]): void {
    if (urls == null) return;

    if (this.property.type == PropertyType.image) {
      this.displayImages = [this.sanitizer.bypassSecurityTrustStyle(`url(${urls})`)];
    } else if (this.property.type == PropertyType.imageList) {
      this.displayImages = (urls as string[]).map((path) =>
        this.sanitizer.bypassSecurityTrustStyle(`url(${path})`)
      );
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  public handleFile(data: ImageCroppedPropertyEvent) {
    let im = this.property.imageMeta;
    if (im && im.cropper) {
      const dialogRef = this.getDialog(data);
      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((e: ImageCroppedPropertyEvent[]) => {
          e.forEach((v) => this.handleFileRead(v.file));
          const files = e.map((f) => f.file);
          this.handleUpdate(files);
        });
    } else {
      let files: File[] = [];
      for (let index = 0; index < data.target.files.length; index++) {
        let file = data.target.files[index];
        this.handleFileRead(file);
        files.push(file);
      }
      this.handleUpdate(files);
    }
  } // handleFile()

  private handleUpdate(files: Blob[]) {
    if (this.multiple) this.onChange(files);
    else this.onChange(files[0]);
  }

  private getDialog(data: ImageCroppedPropertyEvent) {
    data.property = this.property;
    return this.dialog.open(ImageCropperDialogComponent, {
      minWidth: '100vw',
      maxHeight: '100vh',
      disableClose: false,
      panelClass: 'image-cropper-dialog',
      data,
    });
  }

  /** Show preview of the file uploaded */
  private handleFileRead(file: Blob) {
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      let path = <string>reader.result;
      let image = this.sanitizer.bypassSecurityTrustStyle(`url(${path})`);
      const isMutiple = this.isMutiple();
      if (!isMutiple) this.displayImages = [];
      this.displayImages.unshift(image);
    };
    reader.readAsDataURL(file);
  }

  private isMutiple() {
    const type = this.property.type;
    if (type == PropertyType.image) return false;
    else if (type == PropertyType.imageList) return true;
  }
}
