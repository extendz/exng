import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityMeta } from 'extendz/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ext-add-basic',
  templateUrl: './add-basic.component.html',
  styleUrls: ['./add-basic.component.scss'],
})
export class AddBasicComponent {
  entityMeta$: Observable<EntityMeta>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<any>) {}

  onSaved(event: any) {
    console.log('ON saved Basic', event);
    this.dialogRef.close(event);
  }
}
