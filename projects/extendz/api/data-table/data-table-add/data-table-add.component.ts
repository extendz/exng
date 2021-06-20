import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityMeta, ExtEntityConfig, EXT_ENTITY_CONFIG } from 'extendz/core';

@Component({
  selector: 'ext-data-table-add',
  templateUrl: './data-table-add.component.html',
  styleUrls: ['./data-table-add.component.scss'],
})
export class ExtDataTableAddComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public entityMeta: EntityMeta,
    private dialogRef: MatDialogRef<ExtDataTableAddComponent>
  ) {
    console.log(this.entityMeta);
  }

  onSaved(event: any) {
    this.dialogRef.close(event);
  }
}
