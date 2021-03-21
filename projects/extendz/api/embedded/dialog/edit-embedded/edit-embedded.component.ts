import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityMeta, Property, PropertyType } from 'extendz/core';
import { ExtEditEmbeddedComponentData } from '../../embedded.component';

@Component({
  selector: 'ext-edit-embedded',
  templateUrl: './edit-embedded.component.html',
  styleUrls: ['./edit-embedded.component.scss'],
})
export class ExtEditEmbeddedComponent implements OnInit {
  // Properties
  public stringProperties: Property[];
  public enumProperties: Property[];
  public booleanProperties: Property[];
  public numberProperties: Property[];
  public embeddedProperties: Property[];
  public emailProperties: Property[];

  public formGroup: FormGroup = new FormGroup({});

  private entityMeta: EntityMeta;

  constructor(
    private dialogRef: MatDialogRef<ExtEditEmbeddedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExtEditEmbeddedComponentData
  ) {
    this.entityMeta = data.entityMeta;
  }

  ngOnInit(): void {
    const properties = Object.values(this.entityMeta.properties);
    this.stringProperties = properties.filter((p) => p.type === PropertyType.string);
    this.enumProperties = properties.filter((p) => p.type === PropertyType.enum);
    this.booleanProperties = properties.filter((p) => p.type === PropertyType.boolean);
    this.numberProperties = properties.filter((p) => p.type === PropertyType.number);
    this.embeddedProperties = properties.filter((p) => p.type === PropertyType.embedded);
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

  public onOkay(): void {
    this.dialogRef.close(this.formGroup.value);
  }
}
