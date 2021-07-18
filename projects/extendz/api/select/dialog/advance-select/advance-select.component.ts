import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExtAdvanceSearchData } from '../../select.component';

@Component({
  selector: 'ext-advance-select',
  templateUrl: './advance-select.component.html',
  styleUrls: ['./advance-select.component.scss'],
})
export class ExtAdvanceSelectComponent {
  public selected: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExtAdvanceSearchData,
    private dialogRef: MatDialogRef<ExtAdvanceSelectComponent>
  ) {}

  onSelect(selected: any[]) {
    if (!this.data.multiSelect) this.dialogRef.close(this.selected[0]);
  }

  onOkay() {
    // Retrun one not muti select
    if (!this.data.multiSelect) this.dialogRef.close(this.selected[0]);
    else this.dialogRef.close(this.selected);
  }
}
