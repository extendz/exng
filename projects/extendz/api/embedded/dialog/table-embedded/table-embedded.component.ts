import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ExtEditEmbeddedComponentData } from '../../embedded.component';

@Component({
  selector: 'ext-table-embedded',
  templateUrl: './table-embedded.component.html',
  styleUrls: ['./table-embedded.component.scss'],
})
export class ExtTableEmbeddedComponent {
  displayedColumns: string[];

  entities: any[] = [];

  @ViewChild(MatTable, { static: true }) matTable: MatTable<any>;

  constructor(
    private dialogRef: MatDialogRef<ExtTableEmbeddedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExtEditEmbeddedComponentData,
    public media: MediaObserver
  ) {
    this.displayedColumns = Object.keys(data.entityMeta.properties);
    if (this.data.entities) this.entities = data.entities;
  }

  onAdd(item: any) {
    if (this.entities == undefined) this.entities = [];
    this.entities.push(item);
    this.matTable.renderRows();
  }

  public onOkay(): void {
    this.dialogRef.close(this.entities);
  }
}
