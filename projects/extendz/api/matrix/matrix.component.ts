import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, forwardRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTable } from '@angular/material/table';
import {
  AbstractEntityService,
  ExtEntityConfig,
  EXT_ENTITY_CONFIG,
  EXT_ENTITY_SERVICE,
  getValueByField,
  MatrixRow,
  Property,
  PropertyType,
  RelationshipType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ext-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MatrixComponent),
    },
  ],
})
export class MatrixComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() property: Property;
  @Input() parentEntity: any;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  columns: MatrixRow[] = [];
  allColumns: string[];
  dataSource: any[] = [];
  showMatrixInput: boolean = true;
  formGroup: FormGroup;
  rows: FormArray = this.formBuilder.array([]);

  onChange: any = () => {};
  onTouched: any = () => {};

  private sub: Subscription;

  constructor(
    @Inject(EXT_ENTITY_CONFIG) private entityConfig: ExtEntityConfig,
    @Inject(EXT_ENTITY_SERVICE) private entityService: AbstractEntityService,
    private entityMetaService: EntityMetaService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = formBuilder.group({
      data: this.rows,
    });
    this.sub = this.formGroup.valueChanges.subscribe((_) =>
      this.onChange(this.formGroup.value.data)
    );
  }

  ngOnInit(): void {
    this.columns = [...this.property.matrixDefinition.static];
    this.allColumns = this.columns.map((c) => c.property.name);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  remove(row: MatrixRow, value: string): void {
    const index = row.values.indexOf(value);
    if (index >= 0) row.values.splice(index, 1);
  }

  add(event: MatChipInputEvent, row: MatrixRow): void {
    const input = event.input;
    const value = event.value;
    if (!row.values) row.values = [];

    if ((value || '').trim()) {
      if (row.property.type == PropertyType.unit) {
        let unit = row.unit;
        if (!unit && row.property.units) unit = row.property.units[0];
        row.values.push({ value: value.trim(), unit });
      } else if (row.property.type == PropertyType.color) {
        row.values.push({ name: value.trim() });
      } else row.values.push(value);
    }
    if (input) input.value = '';
  }

  onOptionSelect(select: any, row: MatrixRow) {
    row.unit = select;
  }

  onAddNew(event: MouseEvent) {
    this.entityService.navigateNew(this.property, this.parentEntity);
  }

  onView(element: any) {
    const url = getValueByField(this.entityConfig.idFeild, element);
    this.entityService.navigate(this.property, url);
  }

  writeValue(obj: any): void {
    if (obj) {
      this.showMatrixInput = false;
      this.property.matrixDefinition.rows.forEach((row) => {
        if (this.allColumns.indexOf(row.property.name) < 0) {
          this.columns.push(row);
          this.allColumns.push(row.property.name);
        }
      });
      this.allColumns.push('view');

      this.dataSource = obj;
      this.updateForm();
      this.formGroup.patchValue({ data: obj });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  updateMatrix() {
    this.showMatrixInput = false;
    this.property.matrixDefinition.rows
      .filter((row) => row.values != undefined)
      .forEach((row) => {
        if (this.allColumns.indexOf(row.property.name) < 0 && row.values.length > 0) {
          this.columns.push(row);
          this.allColumns.push(row.property.name);
        }
      });

    let values = this.property.matrixDefinition.rows
      .filter((row) => row.values != undefined)
      .filter((row) => row.values.length >= 0);

    this.dataSource = this.matrix(values);
    this.updateForm();
  }

  private updateForm() {
    // Generate rows
    this.dataSource.forEach((dataRow) => {
      const row = this.formBuilder.group({});
      Object.keys(dataRow).forEach((r) => {
        let ctrl = new FormControl();
        ctrl.patchValue(dataRow[r]);
        row.addControl(r, ctrl);
      });

      // Add static varitables
      this.property.matrixDefinition.static.forEach((d) => {
        let ctrl = new FormControl();
        row.addControl(d.property.name, ctrl);
      });
      this.rows.push(row);
    });
  }

  private matrix(matrixRows: MatrixRow[]) {
    let r = [];
    const max = matrixRows.length - 1;
    function helper(arr: any, i: number) {
      for (var j = 0, l = matrixRows[i].values.length; j < l; j++) {
        const item = Object.assign({}, arr);
        item[matrixRows[i].property.name] = matrixRows[i].values[j];
        if (i == max) r.push(item);
        else helper(item, i + 1);
      }
    }
    helper([], 0);
    return r;
  }
}
