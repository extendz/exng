import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Property } from 'extendz/core';

@Component({
  selector: 'ext-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ColorComponent),
    },
  ],
})
export class ColorComponent implements OnInit, ControlValueAccessor {
  @Input() property: Property;

  name: string;
  hex: string;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  writeValue(obj: any): void {
    if (obj) {
      this.name = obj.name;
      this.hex = obj.hex;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit(): void {}

  onInputChange(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
    // TODO add hex
    const color = { name: this.name };
    this.onChange(color);
  }
}
