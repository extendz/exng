import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Property } from 'extendz/core';
import { EntityEvent } from 'extendz/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'ext-base-select',
  template: '<p>Please extends me</p>',
})
export abstract class ExtBaseSelectComponent
  implements ControlValueAccessor, MatFormFieldControl<any>
{
  stateChanges = new Subject<void>();
  abstract id: string;

  /*** Events from parent form */
  @Input() events: Observable<EntityEvent>;
  protected eventSubscription: Subscription;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @HostListener('focusout')
  onBlur() {
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }
  focused: boolean = false;

  abstract empty: boolean;

  get shouldLabelFloat() {
    if (this.property.labelFloat == false) return false;
    else return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  get errorState() {
    return this.ngControl.errors !== null && this.ngControl.touched;
  }

  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;
  describedBy = '';

  constructor(public ngControl: NgControl, public fm: FocusMonitor, public elRef: ElementRef) {
    if (this.ngControl) this.ngControl.valueAccessor = this;

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      if (this.focused) this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    if (this.eventSubscription) this.eventSubscription.unsubscribe();
  }

  abstract writeValue(obj: any);

  abstract registerOnChange(fn: any);

  abstract registerOnTouched(fn: any);

  abstract setDisabledState?(isDisabled: boolean);

  abstract setDescribedByIds(ids: string[]);

  abstract onContainerClick(event: MouseEvent);

  /***
   * Current value of the formField
   */
  value: any | any[];

  /***
   * Display value for the current value.
   * Seperation is needed since the acctual selected value is an URL and the display values is a human readble text.
   */
  displayValue: string = '';

  /***
   * On Change the selected form value
   */
  onChange: any = () => {};

  /***
   *On Touch the api selector
   */
  onTouched: any = () => {};

  /***   */
  @Input() property: Property;

  /*** */
  @Input() entity: any;

  /*** */
  @Output() entityChange: EventEmitter<any> = new EventEmitter<any>();
}
