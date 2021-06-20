import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AbstractEntityService, EXT_ENTITY_SERVICE, Property } from 'extendz/core';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'ext-inline-date',
  templateUrl: './inline-date.component.html',
  styleUrls: ['./inline-date.component.scss'],
})
export class InlineDateComponent implements OnInit, OnDestroy {
  @Input() entity: any;
  @Input() property: Property;

  /***Date format */
  @Input() format: string;

  @Output() change = new EventEmitter();

  formGroup: FormGroup;
  subscription: Subscription;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({});
    const ctrl = new FormControl();
    this.formGroup.addControl(this.property.name, ctrl);
    this.formGroup.patchValue(this.entity);
    this.subscription = this.formGroup.valueChanges.subscribe((v) => {
      this.change.emit(v);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onDateApply() {}
}
