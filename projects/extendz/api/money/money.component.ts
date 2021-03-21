import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  AbstractDataTableService,
  Currency,
  ExtEntityConfig,
  EXT_DATA_TABLE_SERVICE,
  EXT_ENTITY_CONFIG,
  Price,
  Property,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, mergeMap, tap } from 'rxjs/operators';

export function phoneNumberValidator(control: AbstractControl) {
  console.log(control.value);

  console.log('Validating', control);
}

@Component({
  selector: 'ext-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: forwardRef(() => MoneyComponent) }],
})
export class MoneyComponent implements OnInit, ControlValueAccessor, MatFormFieldControl<Price> {
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
  get value(): Price | null {
    let n = this.priceFormGroup.valid;
    return n ? this.priceFormGroup.value : null;
  }
  set value(price: Price | null) {
    this.priceFormGroup.patchValue(price);
    this.stateChanges.next();
  }

  @HostListener('focusout')
  onBlur() {
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }

  currencies$: Observable<Currency[]>;

  priceFormGroup: FormGroup;

  stateChanges = new Subject<void>();
  id = `ext-money-${MoneyComponent.nextId++}`;

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
    let n = this.priceFormGroup.value;
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

    this.priceFormGroup = this.formbuilder.group({
      value: [null, Validators.required],
      currency: [null, Validators.required],
    });

    this.priceFormGroup.valueChanges.pipe(debounceTime(100)).subscribe((v: Price) => {
      if (v.currency && v.value) this.onChange(v);
    });

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      // this.focused = !!origin;
      // this.stateChanges.next();
    });
  }

  ngOnInit(): void {
    this.currencies$ = this.entityMetaService.getModel(this.entityConfig.currency.model).pipe(
      mergeMap((m) => this.dataTableService.getData(m)),
      map((d) => d.data),
      // Set default value if there is not currecy set at this time
      tap((cs: Currency[]) => {
        const currencyE = this.entityConfig.currency;
        let currency = cs.filter((c) => c.code == currencyE.defaultCurrency)[0];
        if (!currency) currency = cs[0];
        this.priceFormGroup.patchValue({ currency });
      })
    );
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
    if (price) this.priceFormGroup.patchValue(price);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
