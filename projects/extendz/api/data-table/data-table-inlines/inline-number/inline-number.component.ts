import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Property } from 'extendz/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ext-inline-number',
  templateUrl: './inline-number.component.html',
  styleUrls: ['./inline-number.component.scss'],
})
export class InlineNumberComponent implements OnInit {
  @Input() entity: any;
  @Input() control: FormControl;
  @Input() property: Property;
  @Output() change = new EventEmitter();

  formGroup: FormGroup;
  subscription: Subscription;
  isPopoverOpen: boolean;
  edit: boolean = false;

  ngOnInit(): void {
    if (this.entity != null) {
      this.control = new FormControl();
      this.control.setValue(this.entity[this.property.name]);
    }
  }

  showPopover() {
    setTimeout(() => {
      this.isPopoverOpen = !this.isPopoverOpen;
    }, 100);
  }

  emit() {
    const sending = {};
    sending[this.property.name] = this.control.value;
    this.change.emit(sending);
  }
}
