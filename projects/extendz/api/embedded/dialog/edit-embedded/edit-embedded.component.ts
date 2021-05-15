import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
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
  constructor(
    private dialogRef: MatDialogRef<ExtEditEmbeddedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExtEditEmbeddedComponentData,
    public media: MediaObserver
  ) {}

  ngOnInit(): void {}

  public onOkay(): void {
    // this.dialogRef.close(this.formGroup.value);
  }
}
