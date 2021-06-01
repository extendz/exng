import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import { Mutate, Property, PropertyType } from 'extendz/core';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';

@Component({
  selector: 'ext-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: forwardRef(() => InputTableComponent) }],
})
export class InputTableComponent
  extends ExtBaseSelectComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  static nextId = 0;
  id = `ext-input-table-${InputTableComponent.nextId++}`;

  get empty() {
    return this.value != null;
  }

  /*** Tab Property  */
  @Input() property: Property;

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  formGroup: FormGroup;
  dataSource: any[] = [];
  rows: FormArray = this.formBuilder.array([]);
  allColumns: string[];

  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    @Optional() @Self() ngControl: NgControl,
    fm: FocusMonitor,
    elRef: ElementRef,
    public media: MediaObserver
  ) {
    super(ngControl, fm, elRef);
  }

  ngOnInit(): void {
    if (this.property) {
      this.allColumns = Object.keys(this.property.entityMeta.properties);
      //
      // this.allColumns.push('save');

      this.formGroup = this.formBuilder.group({
        data: this.rows,
      });
    }

    this.subscription = this.formGroup.valueChanges
      .pipe(skip(1))
      .subscribe((v) => this.onChange(v.data));
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSelectionChange(entity: any, currentProperty: Property, index: number) {
    // if any mutations
    if (this.property.mutations) {
      const key = currentProperty.name;

      // mutation for given property
      const mutations: Mutate[] = this.property.mutations[key];
      const mute = {};
      console.log(entity);
      mutations.forEach((m) => {
        mute[m.to] = entity[m.from];
      });
      this.rows.controls[index].patchValue(mute);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.value) (this.value as any[]).forEach((v) => this.addRow(v));
      else this.addRow();
    }, 0);
  }

  addRow(entity?: any) {
    const row = this.formBuilder.group({});
    Object.values(this.property.entityMeta.properties).forEach((prop) => {
      //TODO dissable for type display
      let ctrl = null;
      let value: any;
      if (entity) value = entity[prop.name];
      else if (prop.type == PropertyType.index) value = this.rows.length + 1;

      if (prop.generated) ctrl = new FormControl({ value, disabled: true });
      else ctrl = new FormControl(value);

      row.addControl(prop.name, ctrl);
    });

    //TODO add _links. should be used as id feild than this
    let linksCtrl = new FormControl();
    if (entity && entity._links) linksCtrl = new FormControl(entity._links);
    row.addControl('_links', linksCtrl);

    this.dataSource.push(entity);
    this.rows.push(row);
    this.table.renderRows();
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  writeValue(obj: any[]): void {
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
