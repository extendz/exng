import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityMeta } from 'extendz/core';
import { Observable } from 'rxjs';
import { ExtAddNewData } from '../../select.component';

@Component({
  selector: 'ext-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
})
export class ExtAddNewComponent {
  entityMeta$: Observable<EntityMeta>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExtAddNewData,
    private dialogRef: MatDialogRef<ExtAddNewComponent>
  ) {}

  onSaved(event: any) {
    this.dialogRef.close(event);
  }
}
