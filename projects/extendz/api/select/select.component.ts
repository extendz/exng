import { HttpParams } from '@angular/common/http';
import { Component, forwardRef, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import {
  AbstractDataTableService,
  EntityMeta,
  ExtApiConfig,
  EXTENDZ_API_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  Property,
  RelationshipType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, take } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';
import { ExtAdvanceSelectComponent } from './dialog/advance-select/advance-select.component';

export interface ExtAdvanceSearchData {
  entityMeta: EntityMeta;
  entity: any;
  property: Property;
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
    @Inject(EXTENDZ_API_CONFIG) public config: ExtApiConfig,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    private entityMetaService: EntityMetaService,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit(): void {
    // Prop
    let disabled = this.property.relationshipType === RelationshipType.oneToMany ? true : false;
    this.autoCompleteControl = new FormControl({ value: '', disabled });

    this.entityMetaService.getModel(this.property.reference).subscribe((d) => {
      this.entityMeta = d;
      // Set search
      if (this.entityMeta.search) this.searchField = this.entityMeta.search.default;
      else this.searchField = this.entityMeta.properties[0].name;
      // console.log('Goe em', this.entityMeta);
    });

    this.autoCompleteData$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      map((v: string) => new HttpParams().append(this.searchField, v)),
      switchMap((p) => this.dataTableService.getData(this.entityMeta, p)),
      map((d) => d.data)
    );
  } //ngOnInit

  get getDisplayValue() {
    return (entity: any) => {
      if (typeof entity == 'string') return entity;
      else if (Object.keys(entity).length === 0) return null;
      return entity[this.entityMeta.title];
    };
  } //getDisplayValue()

  /***
   * This will make the given obejct null or remove the value
   */
  public onRemoveObject(event: MouseEvent, property: Property) {
    event.stopPropagation();
    this.autoCompleteControl.setValue('');
    this.value = '_null';
    this.onChange(this.value);
    this.displayValue = null;
  } //onRemoveObject()

  public onAdvanceSearch(event: MouseEvent, replace: boolean) {
    event.stopPropagation();
    let data: ExtAdvanceSearchData = {
      entityMeta: this.entityMeta,
      entity: this.entity,
      property: this.property,
    };
    let dialogRef = this.dialog.open(ExtAdvanceSelectComponent, {
      data,
      width: '90vw',
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((r) => r != undefined)
        // filter((r: string[]) => r.length <= 0)
      )
      .subscribe((result: object | object[]) => this.handleEmbedded(result));
  } //onAdvanceSearch()

  private handleEmbedded(result: object | object[]) {
    this.value = result;
    this.onChange(this.value);
    if (Array.isArray(result)) {
      this.displayValue = `${result.length} selected`;
      this.autoCompleteControl.setValue(this.displayValue);
    } else this.autoCompleteControl.setValue(result);
  } //handleEmbedded()

  public onAutoComple(event: MouseEvent) {
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

  writeValue(obj: object): void {
    if (obj) this.handleEmbedded(obj);
  }

  setDisabledState?(isDisabled: boolean): void {}
}
