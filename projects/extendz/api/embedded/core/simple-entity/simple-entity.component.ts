import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Property, PropertyType } from 'extendz/core';
import { ExtEditEmbeddedComponentData } from '../../embedded.component';

@Component({
  selector: 'ext-simple-entity',
  templateUrl: './simple-entity.component.html',
  styleUrls: ['./simple-entity.component.scss'],
})
export class SimpleEntityComponent implements OnInit {
  @Input() data: ExtEditEmbeddedComponentData;

  @Output() add: any = new EventEmitter<any>();

  public formGroup: FormGroup = new FormGroup({});
  public propertyTypes = PropertyType

  // Properties
  public stringProperties: Property[];
  public enumProperties: Property[];
  public booleanProperties: Property[];
  public numberProperties: Property[];
  public dateProperties: Property[];
  public emailProperties: Property[];

  constructor(public media: MediaObserver) {}

  ngOnInit(): void {
    const properties = Object.values(this.data.entityMeta.properties);
    this.stringProperties = properties.filter((p) => p.type === PropertyType.string);
    this.enumProperties = properties.filter((p) => p.type === PropertyType.enum);
    this.booleanProperties = properties.filter((p) => p.type === PropertyType.boolean);
    this.numberProperties = properties.filter((p) => p.type === PropertyType.number);
    this.dateProperties = properties.filter((p) => p.type === PropertyType.date);
    this.emailProperties = properties.filter((p) => p.type === PropertyType.email);
    // Create form
    properties.forEach((p) => {
      let ctrl = new FormControl();
      // Validators
      let validators: ValidatorFn[] = [];
      if (p.required) validators.push(Validators.required);
      if (p.type == PropertyType.email) validators.push(Validators.email);
      ctrl.setValidators(validators);

      if (p.generated) ctrl.disable({});
      this.formGroup.addControl(p.name, ctrl);
    });
    if (this.data.entity) this.formGroup.patchValue(this.data.entity);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.add.emit(this.formGroup.value);
      this.formGroup.reset();
    }
  }
}
