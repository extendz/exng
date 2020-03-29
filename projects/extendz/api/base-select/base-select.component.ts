import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Property } from 'extendz/core';

@Component({
  selector: 'ext-base-select',
  templateUrl: './base-select.component.html',
  styleUrls: ['./base-select.component.scss']
})
export class BaseSelectComponent implements OnInit {
  /***
   *
   */
  protected value: string | string[] | object | object[];
  /**
   * Display value for the current value.
   * Seperation is needed since the acctual selected value is an URL and the display values is a human readble text.
   */
  public displayValue: string = '';
  /**
   * On Change the selected form value
   */
  public onChange: any = () => {};
  /**
   *On Touch the api selector
   */
  public onTouched: any = () => {};

  /***
   *
   */
  @Input() property: Property;

  /*** */
  @Input() entity: any;
  /*** */
  @Output() entityChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  /***
   * This will make the given obejct null or remove the value
   */
  public onRemoveObject(event: MouseEvent, property: Property) {
    event.preventDefault();
    this.value = '_null';
    this.onChange(this.value);
    this.displayValue = null;
  }
  /***
   *
   */
  public onQuickAdd(event: MouseEvent, edit: boolean) {
    event.preventDefault();
  }
} // class
