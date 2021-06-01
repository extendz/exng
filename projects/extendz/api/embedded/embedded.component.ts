import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, ElementRef, forwardRef, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
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
    { provide: MatFormFieldControl, useExisting: forwardRef(() => ExtEmbeddedComponent) },
  ],
})
export class ExtEmbeddedComponent
  extends ExtBaseSelectComponent
  implements OnInit, ControlValueAccessor
{
  static nextId = 0;
  id = `ext-embedded-${ExtEmbeddedComponent.nextId++}`;

  get empty() {
    return this.value != null;
  }

  propertyType: PropertyType;
  propertyTypes = PropertyType;

  constructor(
    private dialog: MatDialog,
    @Optional() @Self() ngControl: NgControl,
    fm: FocusMonitor,
    elRef: ElementRef
  ) {
    super(ngControl, fm, elRef);
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

  onMore(event: MouseEvent) {
    event.stopPropagation();
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

  setDescribedByIds(ids: string[]) {
    throw new Error('Method not implemented.');
  }

  onContainerClick(event: MouseEvent) {
    throw new Error('Method not implemented.');
  }
}
