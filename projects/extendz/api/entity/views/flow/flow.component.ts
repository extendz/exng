import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AbstractView } from '../abstact-view';
import { ExtBaseViewComponent } from '../base-view/base-view.component';

@Component({
  selector: 'ext-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
})
export class FlowComponent extends ExtBaseViewComponent implements OnInit, OnDestroy, AbstractView {
  properties: Property[];
  propertyTypes = PropertyType;

  validateSub: Subscription;

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
    this.validateSub = this.formGroup.valueChanges
      .pipe(
        tap((_) => this.validate(this.entityMeta.validators))
        // tap(console.log)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.validateSub) this.validateSub.unsubscribe();
  }

  handleEntityMeta(propties: Property[]) {
    this.properties = propties;
  }

  validate(validations: Validation[]) {
    if (validations)
      validations.forEach((v) => {
        switch (v.assert) {
          case Assert.NotEqual:
            if (this.formGroup.controls[v.on].value != v.value)
              v.disable.forEach((d) => this.formGroup.controls[d].disable({ emitEvent: false }));
            else v.disable.forEach((d) => this.formGroup.controls[d].enable({ emitEvent: false }));
            break;
        }
      });
  }
}
