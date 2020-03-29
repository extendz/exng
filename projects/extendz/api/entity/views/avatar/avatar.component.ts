import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
  EntityMeta,
  ExtEntityConfig,
  EXT_ENTITY_CONFIG,
  Property,
  PropertyType
} from 'extendz/core';
import { AbstractView } from '../abstact-view';

@Component({
  selector: 'ext-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class ExtAvatarComponent implements OnInit, AbstractView {
  public entityMeta: EntityMeta;
  public entity: any;
  public imageUrl: string;
  public formGroup: FormGroup = new FormGroup({});

  // Properties
  public stringProperties: Property[];
  public enumProperties: Property[];
  public booleanProperties: Property[];
  public numberProperties: Property[];
  public embeddedProperties: Property[];
  public emailProperties: Property[];
  public objectProperties: Property[];
  public dateProperties: Property[];

  public loading: boolean = false;

  constructor(
    public media: MediaObserver,
    @Inject(EXT_ENTITY_CONFIG) public entityConfig: ExtEntityConfig
  ) {}

  ngOnInit(): void {
    // avart image
    if (this.entity) {
      let urls = this.entityMeta.properties
        .filter((p: Property) => p.type === PropertyType.image)
        .map((p: Property) => this.entity[p.name]);
      this.imageUrl = urls[0];
    } else this.imageUrl = this.entityConfig.placeholderImage;

    this.stringProperties = this.entityMeta.properties.filter(p => p.type === PropertyType.string);
    this.enumProperties = this.entityMeta.properties.filter(p => p.type === PropertyType.enum);
    this.booleanProperties = this.entityMeta.properties.filter(
      p => p.type === PropertyType.boolean
    );
    this.numberProperties = this.entityMeta.properties.filter(p => p.type === PropertyType.number);
    this.embeddedProperties = this.entityMeta.properties.filter(
      p => p.type === PropertyType.embedded
    );
    this.emailProperties = this.entityMeta.properties.filter(p => p.type === PropertyType.email);
    this.objectProperties = this.entityMeta.properties.filter(p => p.type === PropertyType.object);
    this.dateProperties = this.entityMeta.properties.filter(p => p.type === PropertyType.date);

    // Create form
    this.entityMeta.properties.forEach(p => {
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
  } //ngOnInit()

  public onSave(): void {
    if (this.formGroup.valid) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    } else this.formGroup.markAsDirty();
  } //onSave()
} // class
