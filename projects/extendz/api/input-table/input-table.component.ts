import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Mutate, Property } from 'extendz/core';
import { Subscription } from 'rxjs';
import { skip, tap } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';

@Component({
  selector: 'ext-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputTableComponent),
    },
  ],
})
export class InputTableComponent
  extends ExtBaseSelectComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  /***   */
  @Input() property: Property;

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  formGroup: FormGroup;
  dataSource: any[] = [];
  rows: FormArray = this.formBuilder.array([]);
  allColumns: string[];

  subscription: Subscription;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    if (this.property) {
      this.allColumns = Object.keys(this.property.entityMeta.properties);
      //
      this.allColumns.push('save');
      this.formGroup = this.formBuilder.group({
        data: this.rows,
      });
    }

    this.subscription = this.formGroup.valueChanges
      .pipe(
        tap((_) => this.mutate(this.property.mutations)),
        skip(1)
      )
      .subscribe((v) => {
        this.onChange(v.data);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  mutate(mutations: Mutate[]) {
    // console.log('mutations ', mutations);
  }

  save(row: any) {
    console.log(row);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.value) (this.value as any[]).forEach((v) => this.addRow(v));
      else this.addRow();
    }, 0);
  }

  addRow(value?: any) {
    const row = this.formBuilder.group({});
    Object.values(this.property.entityMeta.properties).forEach((prop) => {
      let ctrl = null;
      if (value) ctrl = new FormControl(value[prop.name]);
      else ctrl = new FormControl();
      row.addControl(prop.name, ctrl);
    });

    //TODO add _links. should be used as id feild than this
    let linksCtrl = new FormControl();
    if (value && value._links) linksCtrl = new FormControl(value._links);
    row.addControl('_links', linksCtrl);

    this.dataSource.push(value);
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
}
