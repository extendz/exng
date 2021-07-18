import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectBasicModel } from '../../select.component';

@Component({
  selector: 'ext-select-basic',
  templateUrl: './select-basic.component.html',
  styleUrls: ['./select-basic.component.scss'],
})
export class SelectBasicComponent implements OnInit {
  allColumns = [];
  properties = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: SelectBasicModel) {
    const properties = Object.values(this.data.entityMeta.properties);

    this.properties = properties.map((p) => p.name).filter((p) => p !== undefined);
    this.allColumns = [...this.properties, 'select'];
  }

  ngOnInit(): void {}
}
