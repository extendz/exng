import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EnumProperty } from 'extendz/core';

@Component({
  selector: 'ext-input-enum',
  templateUrl: './input-enum.component.html',
  styleUrls: ['./input-enum.component.scss'],
})
export class InputEnumComponent implements OnInit {
  @Input() property: EnumProperty;
  @Input() control: FormControl;

  constructor() {}

  ngOnInit(): void {}
}
