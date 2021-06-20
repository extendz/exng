import { FocusMonitor } from '@angular/cdk/a11y';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, forwardRef, Inject, OnInit, Optional, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  AbstractDataTableService,
  AbstractEntityService,
  EntityMeta,
  ExtApiConfig,
  EXT_API_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  EXT_ENTITY_SERVICE,
  Property,
  PropertyType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { iif, Observable, of } from 'rxjs';
import { debounceTime, filter, map, switchMap, take } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';
import { ExtAddNewComponent } from './dialog/add-new/add-new.component';
import { ExtAdvanceSelectComponent } from './dialog/advance-select/advance-select.component';

export interface ExtAdvanceSearchData {
  entityMeta: EntityMeta;
  entity: any;
  property: Property;
}

export interface ExtAddNewData {
  entityMeta: EntityMeta;
}

@Component({
  selector: 'ext-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: forwardRef(() => ExtSelectComponent) }],
})
export class ExtSelectComponent extends ExtBaseSelectComponent implements OnInit {
  static nextId = 0;
  id = `ext-select-${ExtSelectComponent.nextId++}`;

  get empty() {
    return this.value == undefined;
  }

  autoCompleteControl: FormControl;
  autoCompleteData$: Observable<any>;
  entityMeta: EntityMeta;
  searchField: string;

  allowSearch: boolean = true;
  showAddButton: boolean;
  showMoreButton: boolean = true;

  private projection?: string;

  constructor(
    @Inject(EXT_API_CONFIG) public config: ExtApiConfig,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    @Inject(EXT_ENTITY_SERVICE) protected entityService: AbstractEntityService,
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
      map((d) => {
        if (this.property?.config?.select?.autocomplete != false) return d.data;
        else [];
      })
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

  onView(event: MouseEvent, property: Property) {
    // this.entityMetaService.navigateToEntity(id, model);
    this.entityService.navigateExisting(property, this.value);
  }

  addNew(event: MouseEvent, property: Property) {
    this.entityMetaService
      .getModel(property.reference)
      .pipe(take(1))
      .subscribe((entityMeta) => {
        let data: ExtAddNewData = { entityMeta };
        let dialogRef = this.dialog.open(ExtAddNewComponent, {
          data,
          panelClass: 'ext-advance-select',
          width: '90vw',
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

  onAdvanceSearch(event: MouseEvent, replace: boolean) {
    let data: ExtAdvanceSearchData = {
      entityMeta: this.entityMeta,
      entity: this.entity,
      property: this.property,
    };

    let dialogRef = this.dialog.open(ExtAdvanceSelectComponent, {
      data,
      panelClass: 'ext-advance-select',
      width: '90vw',
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((r) => r != undefined)
      )
      .subscribe((result: any | any[]) => this.handleEmbedded(result));
  }

  private handleEmbedded(result: any | any[]) {
    let type = this.property.type;
    if (type == PropertyType.object) {
      this.value = result;
      this.autoCompleteControl.setValue(result);
      this.onChange(this.value);
    } else if (type == PropertyType.objectList) {
      if (Array.isArray(result)) this.value = result;
      else this.value = [result];
      let fun = this.property.config?.select?.displayFunction;
      if (fun) {
        const firstItem = this.value[0];
        if (firstItem) this.displayValue = fun.feilds.map((f) => firstItem[f]).join(fun.delimiter);
        else this.value = null;
      } else {
        let len = (this.value as any[]).length;
        this.displayValue = `${len} selected`;
      }
      this.autoCompleteControl.setValue(this.displayValue);
      this.onChange(this.value);
    }
    setTimeout(() => this.entityChange.emit(this.value), 0);
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
    if (this.property?.config?.select?.allowSearch == false) {
      this.allowSearch = false;
      this.showMoreButton = false;
    }
    if (obj) {
      this.handleEmbedded(obj);
      this.showMoreButton = true;
    }
    if (obj == undefined) this.showAddButton = true;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.autoCompleteControl.disable();
      this.showMoreButton = false;
      this.showAddButton = false;
    } else {
      this.autoCompleteControl.enable();
      this.showMoreButton = true;
      this.showAddButton = false;
    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {}
}
