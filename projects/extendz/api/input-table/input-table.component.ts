import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  forwardRef,
  Inject,
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
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import {
  AbstractDataTableService,
  EXT_DATA_TABLE_SERVICE,
  Mutate,
  Operation,
  Property,
  PropertyType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Subscription } from 'rxjs';
import { skip, take, tap } from 'rxjs/operators';
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
    protected entityMetaService: EntityMetaService,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
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

      this.formGroup = this.formBuilder.group({
        data: this.rows,
      });
    }

    this.subscription = this.formGroup.valueChanges.pipe(skip(1)).subscribe((v) => {
      if (this.formGroup.valid) this.onChange(v.data);
      else this.onChange(null);
    });
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
      mutations.forEach((m) => {
        mute[m.to] = entity[m.from];
      });
      this.rows.controls[index].patchValue(mute);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.value) (this.value as any[]).forEach((v) => this.addRow(v));
      // else this.addRow();
    }, 0);
  }

  onOperation(property: Property, index: number) {
    let value: any = this.rows.controls[index].value;
    switch (property.operation) {
      case Operation.delete:
        const em = this.entityMetaService.getModelSync(property.reference);
        this.dataTableService
          .delete(em, [value])
          .pipe(
            take(1),
            tap((d) => this.removeAt(index))
          )
          .subscribe();
        break;
      case Operation.remove:
        this.removeAt(index);
        break;
    }
  }
  private removeAt(index: number) {
    this.rows.removeAt(index);
    this.dataSource.splice(index, 1);
    this.table.renderRows();
  }

  addRow(entity?: any) {
    const row = this.formBuilder.group({});
    Object.values(this.property.entityMeta.properties).forEach((property) => {
      //TODO dissable for type display
      let ctrl = null;
      let validators: ValidatorFn[] = [];
      // add validators
      if (property.required) validators.push(Validators.required);

      let value: any;
      if (entity) value = entity[property.name];
      else if (property.type == PropertyType.index) value = this.rows.length + 1;

      if (property.generated) ctrl = new FormControl({ value, disabled: true }, validators);
      else ctrl = new FormControl(value, validators);

      row.addControl(property.name, ctrl);
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
