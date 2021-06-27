import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectProperty } from 'extendz/core';

@Component({
  selector: 'ext-inputs-select',
  templateUrl: './inputs-select.component.html',
  styleUrls: ['./inputs-select.component.scss'],
})
export class InputsSelectComponent implements OnInit {
  @Input() property: SelectProperty;
  @Input() control: FormControl;
  @Input() events: any;

  @Output() change = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
