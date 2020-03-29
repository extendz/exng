import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  AbstractDataTableService,
  EntityMeta,
  EXT_DATA_TABLE_SERVICE,
  Property,
  RelationshipType
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { BaseSelectComponent } from '../base-select/base-select.component';

@Component({
  selector: 'ext-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ExtSelectComponent)
    }
  ]
})
export class ExtSelectComponent extends BaseSelectComponent implements OnInit {
  public autoCompleteControl: FormControl;
  public autoCompleteData$: Observable<any>;
  public entityMeta: EntityMeta;

  constructor(
    private entityMetaService: EntityMetaService,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService
  ) {
    super();
  }

  ngOnInit(): void {
    // Prop
    let disabled = this.property.relationshipType === RelationshipType.oneToMany ? true : false;
    this.autoCompleteControl = new FormControl({ value: '', disabled });

    this.entityMetaService.getModel(this.property.reference).subscribe(d => {
      this.entityMeta = d;
      // console.log('Goe em', this.entityMeta);
    });
    this.autoCompleteData$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      switchMap(t => this.dataTableService.getData(this.entityMeta)),
      map(d => d.data)
    );
  }

  get getDisplayValue() {
    return (entity: any) => {
      if (Object.keys(entity).length === 0) return null;
      return entity[this.entityMeta.title];
    };
  }

  /***
   * This will make the given obejct null or remove the value
   */
  public onRemoveObject(event: MouseEvent, property: Property) {
    event.stopPropagation();
    this.autoCompleteControl.setValue('');
    this.value = '_null';
    this.onChange(this.value);
    this.displayValue = null;
  }

  public onEdit(event: MouseEvent, replace: boolean) {
    event.stopPropagation();
  }

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

  writeValue(obj: any): void {}

  setDisabledState?(isDisabled: boolean): void {}
}
