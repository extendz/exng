import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
  AbstractEntityService,
  deepCopy,
  EntityMeta,
  FileProperty,
  Property,
  PropertyType,
} from 'extendz/core';
import { forkJoin, of } from 'rxjs';
import { finalize, flatMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'ext-base-view',
  template: '<p>Please extend me</p>',
})
export class ExtBaseViewComponent implements OnInit {
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

  constructor(private entityService: AbstractEntityService) {}

  ngOnInit(): void {
    const propties = this.entityMeta.properties;
    this.handleEntityMeta(propties);
    this.handleEntity(propties);
  } // ngOnInit()

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
          // Get the saved object and deepCopy
          tap((d) => this.deepCopy(d)),
          // Upload file save
          flatMap((d) => this.entityService.uploadFiles(d, this.filesMap)),
          finalize(() => (this.loading = false))
        )
        .subscribe();
    } else this.formGroup.markAsDirty();
  } //onSave()
} // class
