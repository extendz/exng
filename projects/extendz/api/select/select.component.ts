import { HttpParams } from '@angular/common/http';
import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import {
  AbstractDataTableService,
  EntityMeta,
  ExtApiConfig,
  EXT_API_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  Property,
  PropertyType,
  RelationshipType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { iif, Observable, of } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, take } from 'rxjs/operators';
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ExtSelectComponent),
    },
  ],
})
export class ExtSelectComponent extends ExtBaseSelectComponent implements OnInit {
  public autoCompleteControl: FormControl;
  public autoCompleteData$: Observable<any>;
  public entityMeta: EntityMeta;
  public searchField: string;

  constructor(
    @Inject(EXT_API_CONFIG) public config: ExtApiConfig,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    private entityMetaService: EntityMetaService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    // Prop
    let disabled = this.property.type === PropertyType.objectList ? true : false;
    this.autoCompleteControl = new FormControl({ value: '', disabled });
    // get first property to set as default search

    this.entityMetaService.getModel(this.property.reference).subscribe((d) => {
      if (!d) throw new Error(`Entity model for ${this.property.reference} could not be found!`);
      this.entityMeta = d;
      // Set search
      if (this.entityMeta.search) this.searchField = this.entityMeta.search.default;
      else this.searchField = Object.values(this.entityMeta.properties)[0].name;
    });

    const auto = this.autoCompleteControl.valueChanges.pipe(
      // startWith(''),
      debounceTime(1000),
      map((v: string) => new HttpParams().append(this.searchField, v)),
      switchMap((p) => this.dataTableService.getData(this.entityMeta, p)),
      map((d) => d.data)
    );

    this.autoCompleteData$ = iif(() => this.searchField != null, auto, of());
  }

  get getDisplayValue() {
    return (entity: any) => {
      if (typeof entity == 'string') return entity;
      else if (Object.keys(entity).length === 0) return null;
      return entity[this.entityMeta.title];
    };
  }

  /***
   * This will make the given obejct null or remove the value
   */
  onRemoveObject(event: MouseEvent, property: Property) {
    this.autoCompleteControl.setValue('');
    this.value = null;
    this.onChange(this.value);
    this.displayValue = null;
  }

  onMore(event: MouseEvent) {
    event.stopPropagation();
  }

  onView() {}

  addNew(event: MouseEvent, property: Property) {
    this.entityMetaService
      .getModel(property.reference)
      .pipe(take(1))
      .subscribe((entityMeta) => {
        let data: ExtAddNewData = {
          entityMeta,
        };
        let dialogRef = this.dialog.open(ExtAddNewComponent, {
          data,
          // panelClass: 'ext-advance-select',
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

  public onAdvanceSearch(event: MouseEvent, replace: boolean) {
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
        // filter((r: string[]) => r.length <= 0)
      )
      .subscribe((result: any | any[]) => this.handleEmbedded(result));
  } //onAdvanceSearch()

  private handleEmbedded(result: any | any[]) {
    this.value = result;
    this.onChange(this.value);
    if (Array.isArray(result)) {
      this.displayValue = `${result.length} selected`;
      this.autoCompleteControl.setValue(this.displayValue);
    } else this.autoCompleteControl.setValue(result);
  } 

  onAutoComple(event: MouseEvent) {
    event.preventDefault();
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.value = event.option.value;
    this.onChange(this.value);
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
}
