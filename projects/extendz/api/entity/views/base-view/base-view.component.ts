import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Params } from '@angular/router';
import {
  AbstractEntityService,
  Action,
  deepCopy,
  EntityMeta,
  ExtApiConfig,
  ExtEntityConfig,
  EXT_ENTITY_CONFIG,
  getValueByField,
  Property,
  PropertyType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { forkJoin, Subscription } from 'rxjs';
import { defaultIfEmpty, finalize, mergeMap, skip, take, tap } from 'rxjs/operators';

@Component({
  selector: 'ext-base-view',
  template: '',
})
export class ExtBaseViewComponent implements OnInit, OnDestroy {
  /*** Hold meta data about the Entity*/
  public entityMeta: EntityMeta;

  /*** Current entitty selected*/
  public entity: any;

  public params: Params;

  /***
   * As soon as the entity get loaded in here.
   * We make a copy of the object. This is to track what we have changed using the forms
   */
  public originalEntity: any;

  /*** Form group */
  public formGroup: FormGroup = new FormGroup({});

  /*** Show loading */
  public loading: boolean = false;

  @Output() action: EventEmitter<Action> = new EventEmitter<Action>();

  // Properties
  public booleanProperties: Property[];
  public dateProperties: Property[];
  public embeddedProperties: Property[];
  public emailProperties: Property[];
  public enumProperties: Property[];
  public imageProperties: Property[];
  public numberProperties: Property[];
  public stringProperties: Property[];
  public objectProperties: Property[];
  public matrixProperties: Property[];
  public unitProperties: Property[];
  public moneyProperties: Property[];
  public colorProperties: Property[];

  private activatedRouteSub: Subscription;

  constructor(
    protected apiConfig: ExtApiConfig,
    @Inject(EXT_ENTITY_CONFIG) protected entityConfig: ExtEntityConfig,
    protected entityService: AbstractEntityService,
    protected activatedRoute: ActivatedRoute,
    protected entityMetaService: EntityMetaService
  ) {
    this.activatedRouteSub = this.activatedRoute.params.pipe(skip(1)).subscribe((d) => this.init());
  }

  ngOnInit(): void {
    // Resolve params
    const reqs = [];
    if (this.params) {
      Object.keys(this.params).forEach((key) => {
        const value = this.params[key];
        const property = this.entityMeta.properties[key];
        if (!this.entity) this.entity = {};
        if (property) {
          switch (property.type) {
            case PropertyType.string:
              this.entity[key] = value;
              break;
            case PropertyType.object:
              const r = this.entityMetaService.getModel(key).pipe(
                take(1),
                mergeMap((em) => this.entityService.getOne(em, value)),
                tap((m) => {
                  this.entity[key] = m;
                })
              );
              reqs.push(r);
              break;
          }
        } else throw new Error(`Property ${key} not found`);
      });
    }
    forkJoin(reqs)
      .pipe(defaultIfEmpty(null))
      .subscribe((_) => this.init());
  }

  ngOnDestroy(): void {
    if (this.activatedRouteSub) this.activatedRouteSub.unsubscribe();
  }

  private init() {
    const properties = Object.values(this.entityMeta.properties);
    let filteredProperties: Property[] = [];
    // Update
    if (getValueByField(this.entityConfig.idFeild, this.entity)) {
      if (this.entityMeta.commands && this.entityMeta.commands['update']) {
        const createProps = this.entityMeta.commands['update'].properties;
        properties.forEach((p) => {
          if (createProps.indexOf(p.name) > -1) filteredProperties.push(p);
          else if (p.command != undefined) filteredProperties.push(p);
        });
      }
    }

    // New
    else {
      if (this.entityMeta.commands && this.entityMeta.commands['create']) {
        const createProps = this.entityMeta.commands['create'].properties;
        properties.forEach((p) => {
          if (createProps.indexOf(p.name) > -1) filteredProperties.push(p);
        });
      }
    }

    if (filteredProperties.length == 0) filteredProperties = properties;
    this.handleEntityMeta(filteredProperties);
    this.handleEntity(filteredProperties);
  }

  private handleEntityMeta(propties: Property[]) {
    this.stringProperties = propties.filter((p) => p.type === PropertyType.string);
    this.enumProperties = propties.filter((p) => p.type === PropertyType.enum);
    this.booleanProperties = propties.filter((p) => p.type === PropertyType.boolean);
    this.numberProperties = propties.filter((p) => p.type === PropertyType.number);
    this.embeddedProperties = propties.filter((p) => p.type === PropertyType.embedded);
    this.emailProperties = propties.filter((p) => p.type === PropertyType.email);
    this.objectProperties = propties.filter((p) => p.type === PropertyType.object);
    this.dateProperties = propties.filter((p) => p.type === PropertyType.date);
    this.imageProperties = propties.filter((p) => p.type === PropertyType.image);
    this.matrixProperties = propties.filter((p) => p.type === PropertyType.matrix);
    this.unitProperties = propties.filter((p) => p.type === PropertyType.unit);
    this.colorProperties = propties.filter((p) => p.type === PropertyType.color);
    this.moneyProperties = propties.filter((p) => p.type === PropertyType.money);
  }

  private handleEntity(propties: Property[]) {
    // Create form
    propties.forEach((p) => {
      let ctrl = new FormControl();
      // Validators
      let validators: ValidatorFn[] = [];
      if (p.required) validators.push(Validators.required);
      if (p.type == PropertyType.email) validators.push(Validators.email);
      ctrl.setValidators(validators);
      if (p.generated) ctrl.disable({});
      this.formGroup.addControl(p.name, ctrl);
    });
    if (this.entity) this.formGroup.patchValue(this.entity);
    this.deepCopy(this.entity);
  } // handleEntity()

  private deepCopy(entity: any) {
    this.originalEntity = deepCopy(entity);
  }

  /*** save */
  public onSave(): void {
    if (this.formGroup.valid) {
      this.loading = true;
      this.entityService
        .save(this.entityMeta, this.formGroup.value, true, this.originalEntity)
        .pipe(
          tap((d) => (this.entity = d)),
          tap((d) => this.deepCopy(d)),
          finalize(() => (this.loading = false))
        )
        .subscribe();
    } else this.formGroup.markAllAsTouched();
  }

  public onBooleanChange(event: MatCheckboxChange, property: Property) {
    console.log(event.checked, property.command, this.entity);
  }

  public onAction(action: string) {
    let a: Action = {
      action,
      entity: this.entity,
    };
    this.action.emit(a);
  }
} // class
