import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExtSelectComponent } from '../../select/select.component';
import { EntityEvent, SelectProperty } from 'extendz/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ext-inputs-select',
  templateUrl: './inputs-select.component.html',
  styleUrls: ['./inputs-select.component.scss'],
})
export class InputsSelectComponent {
  @Input() property: SelectProperty;
  @Input() control: FormControl;
  @Input() events: Subject<EntityEvent>;

  @Output() change = new EventEmitter();
}
