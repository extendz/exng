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
import { AbstractView } from '../abstact-view';

@Component({
  selector: 'ext-base-view',
  template: '',
})
export abstract class ExtBaseViewComponent extends AbstractView implements OnInit, OnDestroy {
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

  /*** Emit event on succes save */
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();

  private activatedRouteSub: Subscription;

  constructor(
    protected apiConfig: ExtApiConfig,
    @Inject(EXT_ENTITY_CONFIG) protected entityConfig: ExtEntityConfig,
    protected entityService: AbstractEntityService,
    protected activatedRoute: ActivatedRoute,
    protected entityMetaService: EntityMetaService
  ) {
    super();
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

  abstract handleEntityMeta(propties: Property[]);

  private handleEntity(properties: Property[]) {
    // Create form
    properties.forEach((p) => {
      if (p.type == PropertyType.tabs) p.tabs.forEach((tp) => this.createCtrlForProp(tp));
      else this.createCtrlForProp(p);
    });
    if (this.entity) this.formGroup.patchValue(this.entity, { emitEvent: false });
    this.deepCopy(this.entity);
  }

  private createCtrlForProp(property: Property) {
    let ctrl = new FormControl(undefined);
    let validators: ValidatorFn[] = [];
    if (property.required) validators.push(Validators.required);
    if (property.type == PropertyType.email) validators.push(Validators.email);
    ctrl.setValidators(validators);
    if (property.generated) ctrl.disable({});
    this.formGroup.addControl(property.name, ctrl);
  }

  private deepCopy(entity: any) {
    this.originalEntity = deepCopy(entity);
  }

  /*** save */
  public onSave(showSnackBar?: boolean): void {
    if (this.formGroup.valid) {
      this.loading = true;
      this.entityService
        .save(this.entityMeta, this.formGroup.value, true, this.originalEntity, showSnackBar)
        .pipe(
          tap((d) => (this.entity = d)),
          tap((d) => this.deepCopy(d)),
          tap((d) => this.saved.emit(d)),
          finalize(() => (this.loading = false))
        )
        .subscribe();
    } else {
      this.formGroup.markAllAsTouched();
      this.loading = false;
    }
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
