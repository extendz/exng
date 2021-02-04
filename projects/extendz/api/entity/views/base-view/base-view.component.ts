import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractEntityService,
  Action,
  deepCopy,
  EntityMeta,
  ExtApiConfig,
  FileProperty,
  Property,
  PropertyType,
} from 'extendz/core';
import { Subscription } from 'rxjs';
import { finalize, mergeMap, skip, tap } from 'rxjs/operators';

@Component({
  selector: 'ext-base-view',
  template: '<p>Please extend me</p>',
})
export class ExtBaseViewComponent implements OnInit, OnDestroy {
  /***
   *
   */
  public entityMeta: EntityMeta;
  /***
   *
   */
  public entity: any;
  /***
   * As soon as the entity get loaded in here.
   * We make a copy of the object. This is to track what we have changed using the forms
   */
  public originalEntity: any;
  /***
   * Files map arranged by property name
   */
  public filesMap: Map<string, FileProperty[]> = new Map();
  /***
   * Defualt form group
   */
  public formGroup: FormGroup = new FormGroup({});
  /***
   *
   */
  public loading: boolean = false;

  @Output()
  public action: EventEmitter<Action> = new EventEmitter<Action>();

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

  private activatedRouteSub: Subscription;

  constructor(
    private apiConfig: ExtApiConfig,
    private entityService: AbstractEntityService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRouteSub = this.activatedRoute.params.pipe(skip(1)).subscribe((d) => this.init());
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    if (this.activatedRouteSub) this.activatedRouteSub.unsubscribe();
  }

  private init() {
    const propties = this.entityMeta.properties;
    let filteredProperties: Property[] = [];
    // Update
    if (this.resolve(this.apiConfig.idFeild, this.entity)) {
      if (this.entityMeta.commands && this.entityMeta.commands['update']) {
        const createProps = this.entityMeta.commands['update'].properties;
        propties.forEach((p) => {
          if (createProps.indexOf(p.name) > -1) filteredProperties.push(p);
          else if (p.command != undefined) filteredProperties.push(p);
        });
      }
    }

    // New
    else {
      if (this.entityMeta.commands && this.entityMeta.commands['create']) {
        const createProps = this.entityMeta.commands['create'].properties;
        propties.forEach((p) => {
          if (createProps.indexOf(p.name) > -1) filteredProperties.push(p);
        });
      }
    }

    if (filteredProperties.length == 0) filteredProperties = propties;
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
  } // handleEntityMeta()

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

  private resolve(path: string, obj: any, separator: string = '.') {
    var properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
  }

  /***
   * Add Event fired from file handlers
   */
  public onAdd(event: FileProperty) {
    const key = event.property.name;
    let files = this.filesMap.get(key);
    if (!files) files = [];
    files.push(event);
    this.filesMap.set(key, files);
  } //onAdd()
  /***
   *
   */
  public onSave(): void {
    if (this.formGroup.valid) {
      this.loading = true;
      this.entityService
        .save(this.entityMeta, this.formGroup.value, this.originalEntity)
        .pipe(
          tap((d) => (this.entity = d)),
          // Get the saved object and deepCopy
          tap((d) => this.deepCopy(d)),
          // Upload file save
          mergeMap((d) => this.entityService.uploadFiles(d, this.filesMap)),
          finalize(() => (this.loading = false))
        )
        .subscribe();
    } else this.formGroup.markAsDirty();
  } //onSave()

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
