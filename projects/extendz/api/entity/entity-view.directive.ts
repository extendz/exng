import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ext-entity-view]'
})
export class EntityViewDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
