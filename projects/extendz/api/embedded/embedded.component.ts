import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EntityMeta, Property, PropertyType } from 'extendz/core';
import { filter, take } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';
import { ExtEditEmbeddedComponent } from './dialog/edit-embedded/edit-embedded.component';
import { ExtTableEmbeddedComponent } from './dialog/table-embedded/table-embedded.component';

export interface ExtEditEmbeddedComponentData {
  entityMeta?: EntityMeta;
  propertyType?: PropertyType;
  propertyName?: string;
  generated?: boolean;
  entity?: any;
  entities?: any[];
}

@Component({
  selector: 'ext-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ExtEmbeddedComponent),
    },
  ],
})
export class ExtEmbeddedComponent
  extends ExtBaseSelectComponent
  implements OnInit, ControlValueAccessor {
  propertyType: PropertyType;
  propertyTypes = PropertyType;

  constructor(private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.propertyType = this.property.type;
  }

  onTable(event: MouseEvent) {
    event.preventDefault();
    let entities = null;
    if (this.entity) entities = this.entity[this.property.name];
    const data: ExtEditEmbeddedComponentData = {
      entityMeta: this.property.entityMeta,
      entities,
      generated: this.property.generated,
      propertyType: this.propertyType,
      propertyName: this.property.name,
    };
    const dialogRef = this.dialog.open(ExtTableEmbeddedComponent, {
      data,
      width: '90vw',
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((r) => r != undefined)
      )
      .subscribe((result: object | object[]) => this.handleEmbedded(result, this.property, true));
  }

  /***
   * On edit the embedded entity
   */
  public onEdit(event: MouseEvent, edit: boolean) {
    event.preventDefault();
    let entity = null;
    if (this.entity) entity = this.entity[this.property.name];
    const data: ExtEditEmbeddedComponentData = {
      entityMeta: this.property.entityMeta,
      entity,
      propertyType: this.propertyType,
    };
    const dialogRef = this.dialog.open(ExtEditEmbeddedComponent, {
      data,
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((r) => r != undefined),
        filter((r) => r != '')
      )
      .subscribe((result: object | object[]) => this.handleEmbedded(result, this.property, true));
  } //onEdit()

  private handleEmbedded(result: object | object[], property: Property, replace: boolean) {
    this.value = result;
    this.onChange(this.value);
  }

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
