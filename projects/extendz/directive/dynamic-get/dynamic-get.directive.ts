import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getValueByField } from 'extendz/core';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[extDynamicGet]',
})
export class DynamicGetDirective implements AfterViewInit {
  @Input() request: any;
  @Input() control: FormControl;

  constructor(private http: HttpClient, private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.request !== undefined) {
      const url: string = this.request.url;
      const varibales: any[] = this.request.variables;
      varibales.forEach((v) => {
        if (url.indexOf(v.name) > -1) {
          switch (v.from) {
            case '__parent__':
              const parent = this.control.parent.getRawValue();
              if (v.deep !== undefined) {
                const extracted = getValueByField(v.deep, parent);
                const parsed = url.replace(v.name, extracted);
                this.http
                  .get(parsed)
                  .pipe(take(1))
                  .subscribe((d) => (this.elementRef.nativeElement.innerHTML = d[v.extract]));
              }
              break;
          }
        }
      });
    }
  }
}
