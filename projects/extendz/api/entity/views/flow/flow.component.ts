import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractEntityService,
  Assert,
  ExtApiConfig,
  ExtEntityConfig,
  EXT_API_CONFIG,
  EXT_ENTITY_CONFIG,
  EXT_ENTITY_SERVICE,
  Hidden,
  Property,
  PropertyType,
  Validation,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { tap } from 'rxjs/operators';
import { AbstractView } from '../abstact-view';
import { ExtBaseViewComponent } from '../base-view/base-view.component';

@Component({
  selector: 'ext-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
})
export class FlowComponent extends ExtBaseViewComponent implements OnInit, AbstractView {
  properties: Property[];
  propertyTypes = PropertyType;
  

  constructor(
    @Inject(EXT_API_CONFIG) protected apiConfig: ExtApiConfig,
    @Inject(EXT_ENTITY_CONFIG) public entityConfig: ExtEntityConfig,
    @Inject(EXT_ENTITY_SERVICE) protected entityService: AbstractEntityService,
    protected entityMetaService: EntityMetaService,
    protected activatedRoute: ActivatedRoute,
    public media: MediaObserver,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    super(apiConfig, entityConfig, entityService, activatedRoute, entityMetaService);
    const url = this.sanitizer.bypassSecurityTrustResourceUrl(this.entityConfig.svgIconSet);
    this.iconRegistry.addSvgIconSetInNamespace('api-root', url);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.formGroup.valueChanges
      .pipe(tap((_) => this.validate(this.entityMeta.validators)))
      .subscribe((v) => {});
  }

  handleEntityMeta(propties: Property[]) {
    this.properties = propties;
  }

  validate(validations: Validation[]) {
    if (validations)
      validations.forEach((v) => {
        if (this.formGroup.controls[v.on].value == v.value)
          v.disable.forEach((d) => this.formGroup.controls[d].disable({ emitEvent: false }));
        else v.disable.forEach((d) => this.formGroup.controls[d].enable({ emitEvent: false }));
      });
  }

  canHide(hiden: Hidden) {
    if (hiden == null) return true;
    const assert = hiden.assert;

    switch (assert) {
      case Assert.NotNull:
        if (this.entity && this.entity[hiden.property] != null) return true;
        break;
      case Assert.Null:
        if (this.entity && this.entity[hiden.property] == null) return true;
        break;
    }
  }
}
