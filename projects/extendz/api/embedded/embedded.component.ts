import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EntityMeta, Property } from 'extendz/core';
import { filter, take } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';
import { ExtEditEmbeddedComponent } from './dialog/edit-embedded/edit-embedded.component';

export interface ExtEditEmbeddedComponentData {
  entityMeta: EntityMeta;
  entity: any;
}

@Component({
  selector: 'ext-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ExtEmbeddedComponent)
    }
  ]
})
export class ExtEmbeddedComponent extends ExtBaseSelectComponent
  implements OnInit, ControlValueAccessor {
  constructor(private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {}

  /***
   * On edit the embedded entity
   */
  public onEdit(event: MouseEvent, edit: boolean) {
    event.preventDefault();
    let entity = null;
    if (this.entity) entity = this.entity[this.property.name];
    const dialogRef = this.dialog.open(ExtEditEmbeddedComponent, {
      data: { entityMeta: this.property.entityMeta, entity }
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter(r => r != undefined),
        filter(r => r != '')
      )
      .subscribe((result: object | object[]) => this.handleEmbedded(result, this.property, true));
  } //onEdit()

  private handleEmbedded(result: object | object[], property: Property, replace: boolean) {
    this.value = result;
    this.onChange(this.value);
  } //handleEmbedded()

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
