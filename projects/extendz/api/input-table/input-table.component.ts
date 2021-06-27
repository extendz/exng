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
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import {
  AbstractDataTableService,
  AbstractEntityService,
  EntityEventType,
  EXT_DATA_TABLE_SERVICE,
  EXT_ENTITY_SERVICE,
  getValueByField,
  Mutate,
  MutationType,
  Operation,
  Property,
  PropertyType,
  SelectProperty,
  TabAction,
  ToolbarConfig,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Subscription } from 'rxjs';
import { filter, mergeMap, skip, take, tap } from 'rxjs/operators';
import { ExtBaseSelectComponent } from '../base-select/base-select.component';
import { ExtAdvanceSelectComponent } from '../select/dialog/advance-select/advance-select.component';
import { ExtAdvanceSearchData } from '../select/select.component';

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
  isPopoverOpen: boolean;

  subscription: Subscription;
  toolbarConfig?: ToolbarConfig;

  constructor(
    private formBuilder: FormBuilder,
    protected entityMetaService: EntityMetaService,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    @Inject(EXT_ENTITY_SERVICE) protected entityService: AbstractEntityService,
    @Optional() @Self() ngControl: NgControl,
    fm: FocusMonitor,
    elRef: ElementRef,
    private dialog: MatDialog,
    public media: MediaObserver
  ) {
    super(ngControl, fm, elRef);
  }

  ngOnInit(): void {
    // Lisnt to events
    if (this.events)
      super.eventSubscription = this.events.subscribe((e) => {
        switch (e.type) {
          case EntityEventType.Saved:
            if (this.property.events) {
              const savedMutations = this.property.events[EntityEventType.Saved];
              savedMutations.forEach((m) => {
                switch (m.type) {
                  case MutationType.Enable:
                    // Enable form Gorup
                    if (m.to && m.to[0] == '*') {
                      this.formGroup.enable();
                    } else {
                      //TODO invidividual property to be enables
                      const toBeEnabled: FormControl[] = [];
                      const formArray = this.formGroup.controls.data as FormArray;
                      m.to.forEach((property) => {});
                      toBeEnabled.forEach((c) => c.enable());
                    }

                    break;
                }
              });
            }
        }

        console.log(this.formGroup);
      });

    if (this.property) {
      this.allColumns = Object.keys(this.property.entityMeta.properties);

      this.formGroup = this.formBuilder.group({
        data: this.rows,
      });
    }

    this.subscription = this.formGroup.valueChanges.pipe(skip(1)).subscribe((v) => {
      if (this.formGroup.valid) this.onChange(this.formGroup.getRawValue().data);
      else this.onChange(null);
    });
    // Toolbar config
    this.toolbarConfig = this.property?.entityMeta?.config?.toolbar;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.subscription) this.subscription.unsubscribe();
  }

  onToolbarAction(action: TabAction) {
    switch (action.id) {
      case '__add__':
        if (action.reference != null && action?.multiSelect) this.onAction(action);
        else this.addRow();
        break;
    }
  }

  private removeAt(index: number) {
    this.rows.removeAt(index);
    this.dataSource.splice(index, 1);
    this.table.renderRows();
  }

  private applyDisableMutation(entity: any, key: string, index: number) {
    // if any mutations
    if (this.property.mutations) {
      // mutation for given property
      const mutations: Mutate[] = this.property.mutations[key];
      if (mutations == undefined) return;

      // const mute = {};
      mutations.forEach((m) => {
        switch (m.type) {
          case MutationType.Disable:
            const fg = this.rows.controls[index] as FormGroup;
            // Get all the controllers need to apply
            m.to.forEach((propertyName) => fg.controls[propertyName].disable());
            break;
        }
      });
      // this.rows.controls[index].patchValue(mute, { emitEvent: false });
    }
  }

  onSelectionChange(entity: any, key: string, index: number) {
    // if any mutations
    if (this.property.mutations) {
      // mutation for given property
      const mutations: Mutate[] = this.property.mutations[key];
      if (mutations == undefined) return;

      const mute = {};
      mutations.forEach((m) => {
        m.to.forEach((property) => {
          if (m?.deep == true) {
            mute[property] = getValueByField(m.from, entity);
          } else mute[property] = entity[m.from];
          // Copy current entity
          if (m.from == '.') {
            entity.__update__ = false;
            mute[property] = entity;
          }
        });
      });
      this.rows.controls[index].patchValue(mute, { emitEvent: false });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.value) (this.value as any[]).forEach((v) => this.addRow(v));
      // else this.addRow();
    }, 0);
  }

  onRowChange(entity: any, property: SelectProperty, original: any) {
    this.entityMetaService
      .getModel((this.property as SelectProperty).reference)
      .pipe(
        mergeMap((em) => this.entityService.save(em, entity, false, original, true)),
        take(1)
      )
      .subscribe();
  }

  onNumberChange(data: any, index: number, rowProperty: Property) {
    this.applyDisableMutation(data, rowProperty.name, index);
  }

  onAction(action: TabAction) {
    this.entityMetaService.getModel(action.reference).subscribe((entityMeta) => {
      let data: ExtAdvanceSearchData = {
        entityMeta,
        multiSelect: action.multiSelect,
        params: action.params,
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
        .subscribe((r: any | any[]) => this.handleSelected(r, action.multiSelect, action));
    });
  }

  private handleSelected(selected: any | any[], multiSelect: boolean, action: TabAction) {
    if (multiSelect) {
      (selected as any[]).forEach((e) => {
        const index = this.addRow();
        this.onSelectionChange(e, action.reference, index);
      });
    } else this.addRow(selected as any);
  }

  onOperation(property: SelectProperty, index: number) {
    let value: any = this.rows.controls[index].value;
    switch (property.operation) {
      case Operation.delete:
        this.entityMetaService
          .getModel(property.reference)
          .pipe(
            mergeMap((em) =>
              this.dataTableService.delete(em, [value]).pipe(
                take(1),
                tap((d) => this.removeAt(index))
              )
            )
          )
          .subscribe();
        break;
      case Operation.remove:
        this.removeAt(index);
        break;
    }
  }

  /***
   * @returns index for the added controller
   */
  addRow(entity?: any): number {
    const row = this.formBuilder.group({});

    Object.values(this.property.entityMeta.properties).forEach((property) => {
      //TODO dissable for type display
      let ctrl = null;
      let validators: ValidatorFn[] = [];
      // add validators
      if (property.required) validators.push(Validators.required);

      let value: any;
      if (entity) value = entity[property.name];
      else if (property.type == PropertyType.index) {
        value = this.rows.length + 1;
      }

      if (property.generated || property.type == PropertyType.display)
        ctrl = new FormControl({ value, disabled: true }, validators);
      else ctrl = new FormControl(value, validators);

      row.addControl(property.name, ctrl);
    });

    //TODO add _links. should be used as id feild than this
    let linksCtrl = new FormControl();
    if (entity && entity._links) linksCtrl = new FormControl(entity._links);
    row.addControl('_links', linksCtrl);

    var length = this.dataSource.push(entity);
    this.rows.push(row);
    this.table.renderRows();
    return length - 1;
  }

  getController(propertyName: string, index: number) {
    const array = this.formGroup.controls.data as FormArray;
    const group = array.controls[index] as FormGroup;
    return group.controls[propertyName];
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
