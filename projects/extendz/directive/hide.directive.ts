import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Hidden, shouldHide } from 'extendz/core';

@Directive({
  selector: '[hide]',
})
export class HideDirective implements OnInit {
  @Input() hide: Hidden;
  @Input() entity: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const hide = shouldHide(this.entity, this.hide);
    if (hide) this.elementRef.nativeElement.style.display = 'none';
  }
}
