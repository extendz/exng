import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[displayMask]',
})
export class DisplayMaskDirective implements OnInit {
  @Input() displayField: string;

  constructor(private model: NgControl) {}

  ngOnInit(): void {
    const value = this.model.value;
    if (this.displayField != undefined && value != undefined) {
      this.model.valueAccessor.writeValue(value[this.displayField]);
    }
  }
}
