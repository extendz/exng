import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertyType } from 'extendz/core';
import { ExtAdvanceSearchData } from '../../select.component';

@Component({
  selector: 'ext-advance-select',
  templateUrl: './advance-select.component.html',
  styleUrls: ['./advance-select.component.scss'],
})
export class ExtAdvanceSelectComponent {
  public multiSelect: boolean;
  public selected: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExtAdvanceSearchData,
    private dialogRef: MatDialogRef<ExtAdvanceSelectComponent>
  ) {
    this.multiSelect = data.property.type == PropertyType.object ? false : true;
    console.log(data.property);
  }

  onOkay() {
    // Retrun one not muti select
    if (!this.multiSelect) this.dialogRef.close(this.selected[0]);
    else this.dialogRef.close(this.selected);
  }
}
