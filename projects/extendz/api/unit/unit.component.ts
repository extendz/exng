import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Mesurement, Price, Property } from 'extendz/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ext-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: forwardRef(() => UnitComponent) }],
})
export class UnitComponent
  implements OnInit, ControlValueAccessor, MatFormFieldControl<Mesurement> {
  static nextId = 0;
  @Input() property: Property;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

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

  @Input()
  get value(): Mesurement | null {
    let n = this.formGroup.valid;
    return n ? this.formGroup.value : null;
  }
  set value(mesurement: Mesurement | null) {
    this.formGroup.patchValue(mesurement);
    this.stateChanges.next();
  }

  @HostListener('focusout')
  onBlur() {
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }

  formGroup: FormGroup;

  stateChanges = new Subject<void>();
  id = `ext-money-${UnitComponent.nextId++}`;

  focused: boolean = false;

  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;
  describedBy = '';

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get errorState() {
    return this.ngControl.errors !== null && this.ngControl.touched;
  }

  get empty() {
    let n = this.formGroup.value;
    return n.currecy != undefined && n.value != undefined;
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private fb: FormBuilder,
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef
  ) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
    this.formGroup = this.fb.group({
      unit: [null, Validators.required],
      value: [null, Validators.required],
    });
    this.formGroup.valueChanges.pipe(debounceTime(100)).subscribe((v: Mesurement) => {
      if (v.unit && v.value) this.onChange(v);
    });
  }

  ngOnInit(): void {
    this.formGroup.patchValue({ unit: this.property.units[0] });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }

  writeValue(price: Price): void {
    if (price) this.formGroup.patchValue(price);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
