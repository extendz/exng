import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Input,
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
import {
  AbstractDataTableService,
  Country,
  ExtEntityConfig,
  EXT_DATA_TABLE_SERVICE,
  EXT_ENTITY_CONFIG,
  getValueByField,
  Phone,
  Property,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'ext-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: forwardRef(() => PhoneComponent) }],
})
export class PhoneComponent implements ControlValueAccessor, MatFormFieldControl<Phone> {
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
  get value(): Phone | null {
    let n = this.formGroup.valid;
    return n ? this.formGroup.value : null;
  }
  set value(price: Phone | null) {
    this.formGroup.patchValue(price);
    this.stateChanges.next();
  }

  @HostListener('focusout')
  onBlur() {
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }

  countries$: Observable<Country[]>;

  formGroup: FormGroup;

  stateChanges = new Subject<void>();
  id = `ext-money-${PhoneComponent.nextId++}`;

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
    private formbuilder: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef,
    private entityMetaService: EntityMetaService,
    @Optional() @Self() public ngControl: NgControl,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    @Inject(EXT_ENTITY_CONFIG) public entityConfig: ExtEntityConfig
  ) {
    if (this.ngControl) this.ngControl.valueAccessor = this;

    this.formGroup = this.formbuilder.group({
      number: [null, [Validators.required, Validators.minLength(12)]],
      country: [null, Validators.required],
    });

    this.formGroup.valueChanges.pipe(debounceTime(100)).subscribe((_) => {
      if (this.formGroup.valid) {
        let v = this.formGroup.getRawValue();
        const country = getValueByField(this.entityConfig.idFeild, v.country);
        const number = (v.number as string).substr(0, 12);
        this.onChange({ number, country });
      } else this.onChange(null);
    });

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      // this.focused = !!origin;
      // this.stateChanges.next();
    });
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

  writeValue(phone: Phone): void {
    if (phone) this.formGroup.patchValue(phone, { emitEvent: false });
    this.getCountries(phone);
  }

  getCountries(phone: Phone) {
    this.countries$ = this.entityMetaService.getModel(this.entityConfig.phone.model).pipe(
      mergeMap((m) => this.dataTableService.getData(m)),
      map((d) => d.data),
      // Set default value if there is not currecy set at this time
      tap((contries: Country[]) => {
        let defaultPhone = this.entityConfig.phone;
        if (phone && phone.country) defaultPhone.defaultPhoneCode = phone.country.code;
        let country = contries.filter((c) => c.code == defaultPhone.defaultPhoneCode)[0];
        if (!country) country = contries[0];

        this.formGroup.patchValue({ country });

        if (contries.length == 1) this.formGroup.controls['country'].disable();
      })
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }
}
