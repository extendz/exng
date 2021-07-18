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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import {
  AbstractDataTableService,
  AbstractEntityService,
  Assert,
  DefaultProperty,
  EntityEventType,
  ExtEntityConfig,
  EXT_DATA_TABLE_SERVICE,
  EXT_ENTITY_CONFIG,
  EXT_ENTITY_SERVICE,
  getId,
  getValueByField,
  Mutate,
  MutationType,
  Operation,
  Property,
  PropertyType,
  SelectProperty,
  TabAction,
  ToolbarConfig,
  Validation,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    protected entityMetaService: EntityMetaService,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    @Inject(EXT_ENTITY_SERVICE) protected entityService: AbstractEntityService,
    @Inject(EXT_ENTITY_CONFIG) private entityConfig: ExtEntityConfig,
    @Optional() @Self() ngControl: NgControl,
    fm: FocusMonitor,
    elRef: ElementRef,
    public media: MediaObserver
  ) {
    super(ngControl, fm, elRef);
  }

  ngOnInit(): void {
    // listn to events
    if (this.events)
      super.eventSubscription = this.events.subscribe((e) => {
        switch (e.type) {
          case EntityEventType.Saved:
            if (this.property.events) {
              const savedMutations = this.property.events[EntityEventType.Saved];
              savedMutations.forEach((m) => {
                switch (m.type) {
                  case MutationType.Enable:
                    this.removeAll();
                    if (this.value) (this.value as any[]).forEach((v) => this.addRow(v));
                    // this.rows.clear()
                    // this.validate(this.property.validations)

                    // // Enable form Gorup
                    // if (m.to && m.to[0] == '*') this.formGroup.enable();
                    // else {
                    //   //TODO invidividual property to be enables
                    //   const toBeEnabled: FormControl[] = [];
                    //   const formArray = this.formGroup.controls.data as FormArray;
                    //   m.to.forEach((property) => {});
                    //   toBeEnabled.forEach((c) => c.enable());
                    // }
                    break;
                }
              });
            }
        }
      });

    if (this.property) {
      this.allColumns = Object.keys(this.property.entityMeta.properties);

      this.formGroup = this.formBuilder.group({
        data: this.rows,
      });
    }

    // TODO remove skips https://github.com/angular/angular/issues/23336
    this.subscription = this.formGroup.valueChanges
      .pipe
      // skip(this.value?.length)
      ()
      .subscribe((_) => {
        if (this.formGroup.valid) this.onChange(this.formGroup.getRawValue().data);
        else this.onChange(null);
      });
    // Toolbar config
    this.toolbarConfig = this.property?.entityMeta?.config?.toolbar;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.value) (this.value as any[]).forEach((v) => this.addRow(v));
      // else this.addRow();
    }, 0);
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

      this.rows.controls[index].patchValue(mute, { emitEvent: true });
    }
  }

  onRowChange(entity: any, property: SelectProperty, original: any, index: number) {
    const prop = this.property as SelectProperty;
    const url = getValueByField(this.entityConfig.idFeild, original);
    const id = getId(url);
    let op: Observable<any>;

    if (property?.inlineEdit?.action) {
      const action = property?.inlineEdit?.action;
      const pathVariable = action.pathVariable;
      op = this.entityMetaService.getModel(prop.reference).pipe(
        mergeMap((em) => {
          const postUrl = `${em.url}/${id}/${pathVariable}`;
          return this.entityService.post(postUrl, entity).pipe(
            map((_) => em),
            tap((_) =>
              this.snackBar.open(action.successMessage, null, {
                duration: 3000,
                panelClass: ['snack-bar-info'],
              })
            )
          );
        }),
        catchError((e) => {
          this.updateRow(original, index);
          return throwError(e);
        })
      );
    } else
      this.entityMetaService.getModel((this.property as SelectProperty).reference).pipe(
        mergeMap((em) =>
          this.entityService.save(em, entity, false, original, true).pipe(map((_) => em))
        ),
        take(1)
      );

    op.pipe(
      mergeMap((em) => {
        const id = getId(url);
        return this.entityService.getOne(em, id);
      }),
      tap((entity) => this.updateRow(entity, index))
    ).subscribe();
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

  private removeAt(index: number) {
    this.rows.removeAt(index);
    this.dataSource.splice(index, 1);
    this.table.renderRows();
  }

  private removeAll() {
    this.dataSource.splice(0, this.dataSource.length);
    this.rows.clear();
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
            m.to.forEach((propertyName) => fg.controls[propertyName].disable({ emitEvent: false }));
            break;
        }
      });
      // this.rows.controls[index].patchValue(mute, { emitEvent: false });
    }
  }

  private handleSelected(selected: any | any[], multiSelect: boolean, action: TabAction) {
    if (multiSelect) {
      (selected as any[]).forEach((e) => {
        const index = this.addRow();
        this.onSelectionChange(e, action.reference, index);
      });
    } else this.addRow(selected as any);
  }

  /*** Buttons on the table */
  onOperation(property: SelectProperty, index: number) {
    let formGroup: FormGroup = this.rows.controls[index] as FormGroup;
    let value: any = formGroup.getRawValue();
    const action = property?.actions[0];
    const operation = action?.operation;
    const pre = action?.pre;
    if (pre) {
      console.log(value[pre.on], pre.value);
      switch (pre.assert) {
        case Assert.NotEqual:
          if (value[pre.on] != pre.value) {
            this.snackBar.open(pre.message, 'Ok');
            return;
          }
          break;
      }
    }

    switch (operation) {
      case Operation.delete:
        this.entityMetaService
          .getModel(property.reference)
          .pipe(
            mergeMap((em) =>
              this.dataTableService.delete(em, [value]).pipe(
                take(1),
                tap((_) => this.removeAt(index))
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

  updateRow(entity: any, index: number) {
    const fg = this.rows.controls[index] as FormGroup;
    fg.patchValue(entity, { emitEvent: false });
    this.validate(this.property.entityMeta.validators, fg);
    this.events.next({ type: EntityEventType.RowUpdated, payload: entity, index });
  }

  /***
   * @returns index for the added controller
   */
  addRow(entity?: any): number {
    const row = this.formBuilder.group({});

    Object.values(this.property.entityMeta.properties).forEach((property) => {
      let ctrl = null;
      let validators: ValidatorFn[] = [];
      // add validators
      if (property.required) validators.push(Validators.required);

      let value: any;
      if (entity) value = entity[property.name];
      else if (property?.default != null) value = property.default;
      else if (property.type == PropertyType.index) value = this.rows.length + 1;

      if (property.generated || property.type == PropertyType.display)
        ctrl = new FormControl({ value, disabled: true }, validators);
      else ctrl = new FormControl(value, validators);
      row.addControl(property.name, ctrl);
    });

    // Add default PROPERTIES
    let defaults: DefaultProperty;
    if ((defaults = this.entityConfig?.defaultProperties)) {
      // console.log(defaults);

      if (defaults?.update && entity) {
        defaults.update.forEach((d) => {
          let defaultCtrl = new FormControl();
          defaultCtrl = new FormControl(entity[d]);
          row.addControl(d, defaultCtrl);
        });
      }
    }

    // TODO : https://github.com/angular/angular/issues/23336
    var length = this.dataSource.push(entity);
    this.rows.push(row);
    this.table.renderRows();

    // Validate
    this.validate(this.property.entityMeta.validators, row);

    this.events.next({ type: EntityEventType.RowAdded, payload: entity });

    return length - 1;
  }

  validate(validations: Validation[], formGroup: FormGroup) {
    if (validations)
      validations.forEach((v) => {
        switch (v.assert) {
          case Assert.NotEqual:
            if (formGroup.controls[v.on].value != v.value)
              v.disable.forEach((d) => formGroup.controls[d].disable({ emitEvent: false }));
            else v.disable.forEach((d) => formGroup.controls[d].enable({ emitEvent: false }));
            break;
          case Assert.GreaterThan:
            formGroup.setValidators(this.greaterThan(v));
            break;
        }
      });
  }

  greaterThan(validation: Validation): ValidatorFn {
    return (formGroup: FormGroup) => {
      const onCtrl = formGroup.get(validation.on);
      const sourceCtrl = formGroup.get(validation.valueSource);

      if (onCtrl == null || sourceCtrl == null) return null;
      if (onCtrl.value > sourceCtrl.value) {
        return { greaterThan: true };
      } else return null;
    };
  }

  getController(propertyName: string, index: number) {
    const array = this.formGroup.controls.data as FormArray;
    const group = array.controls[index] as FormGroup;
    return group.controls[propertyName];
  }

  getFormGroup(index: number) {
    const array = this.formGroup.controls.data as FormArray;
    return array.controls[index] as FormGroup;
  }

  isValid(row) {
    console.log('cal', row);
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

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  setDescribedByIds(ids: string[]) {
    throw new Error('Method not implemented.');
  }
  onContainerClick(event: MouseEvent) {
    throw new Error('Method not implemented.');
  }
}
