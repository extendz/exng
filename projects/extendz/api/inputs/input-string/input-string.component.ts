import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Property } from 'extendz/core';

@Component({
  selector: 'ext-input-string',
  templateUrl: './input-string.component.html',
  styleUrls: ['./input-string.component.scss'],
})
export class InputStringComponent implements OnInit {
  @Input() property: Property;
  @Input() control: FormControl;

  constructor() {}

  ngOnInit(): void {}
}
