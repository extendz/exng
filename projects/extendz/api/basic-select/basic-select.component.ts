import { FocusMonitor } from '@angular/cdk/a11y';
import { HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  AbstractDataTableService,
  EntityMeta,
  ExtApiConfig,
  EXT_API_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  Property,
  PropertyType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { SelectProperty } from 'extendz/core';
import { iif, Observable, of } from 'rxjs';
import { debounceTime, filter, map, switchMap, take } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';
import { AddBasicComponent } from './add-basic/add-basic.component';

@Component({
  selector: 'ext-basic-select',
  templateUrl: './basic-select.component.html',
  styleUrls: ['./basic-select.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: forwardRef(() => ExtBasicSelectComponent) },
  ],
})
export class ExtBasicSelectComponent extends ExtBaseSelectComponent implements OnInit {
  @Input() property: SelectProperty;

  static nextId = 0;
  id = `ext-select-${ExtBasicSelectComponent.nextId++}`;

  get empty() {
    return this.value == undefined;
  }

  public autoCompleteControl: FormControl;
  public autoCompleteData$: Observable<any>;
  public entityMeta: EntityMeta;
  public searchField: string;
  private projection?: string;

  constructor(
    @Inject(EXT_API_CONFIG) public config: ExtApiConfig,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    @Optional() @Self() ngControl: NgControl,
    private entityMetaService: EntityMetaService,
    private dialog: MatDialog,
    public fm: FocusMonitor,
    public elRef: ElementRef
  ) {
    super(ngControl, fm, elRef);
    // let disabled = this.property.type === PropertyType.objectList ? true : false;
    this.autoCompleteControl = new FormControl(null);
  }

  ngOnInit(): void {
    this.entityMetaService.getModel(this.property.reference).subscribe((d) => {
      if (!d) throw new Error(`Entity model for ${this.property.reference} could not be found!`);
      this.entityMeta = d;
      // Set search
      if (this.entityMeta.search) this.searchField = this.entityMeta.search.default;
      else this.searchField = Object.values(this.entityMeta.properties)[0].name;
      // projection
      if (this.entityMeta.config && this.entityMeta.config.select)
        this.projection = this.entityMeta.config.select.projection;
    });

    const auto = this.autoCompleteControl.valueChanges.pipe(
      // startWith(''),
      debounceTime(100),
      map((v: string) => {
        let p = new HttpParams().append(this.searchField, v);
        p = p.append('projection', this.projection);
        return p;
      }),
      switchMap((p) => this.dataTableService.getData(this.entityMeta, p)),
      map((d) => d.data)
    );

    this.autoCompleteData$ = iif(() => this.searchField != null, auto, of());
  }

  get getDisplayValue() {
    return (entity: any) => {
      if (!entity) return null;
      else if (typeof entity == 'string') return entity;
      else if (Object.keys(entity).length === 0) return null;
      else return entity[this.entityMeta.title];
    };
  }

  /***
   * This will make the given obejct null or remove the value
   */
  onRemoveObject(event: MouseEvent, property: Property) {
    this.autoCompleteControl.setValue(null);
    this.value = null;
    this.onChange(this.value);
    this.displayValue = null;
  }

  onMore(event: MouseEvent) {
    event.stopPropagation();
  }

  onView() {}

  addNew(event: MouseEvent, property: SelectProperty) {
    event.preventDefault();
    this.entityMetaService
      .getModel(property.reference)
      .pipe(take(1))
      .subscribe((entityMeta) => {
        let data: any = { entityMeta };

        let dialogRef = this.dialog.open(AddBasicComponent, {
          data,
          panelClass: 'ext-advance-select',
          width: '50vw',
        });
        dialogRef
          .afterClosed()
          .pipe(
            take(1),
            filter((r) => r != undefined)
          )
          .subscribe((result: any | any[]) => this.handleEmbedded(result));
      });
  }

  private handleEmbedded(result: any | any[]) {
    let type = this.property.type;
    if (type == PropertyType.object) {
      this.value = result;
      this.onChange(this.value);
      this.autoCompleteControl.setValue(result);
    } else if (type == PropertyType.objectList) {
      if (Array.isArray(result)) this.value = result;
      else this.value = [result];
      let len = (this.value as any[]).length;
      this.onChange(this.value);
      this.displayValue = `${len} selected`;
      this.autoCompleteControl.setValue(this.displayValue);
    }
    this.entityChange.emit(this.value);
  }

  onAutoComple(event: MouseEvent) {
    event.preventDefault();
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.value = event.option.value;
    this.onChange(this.value);
    this.entityChange.emit(event.option.value);
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    if (obj) this.handleEmbedded(obj);
  }

  setDisabledState(isDisabled: boolean): void {}

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {}
}
