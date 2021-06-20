import { Component, Inject, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractEntityService,
  EntityMeta,
  ExtApiConfig,
  ExtEntityConfig,
  EXT_API_CONFIG,
  EXT_ENTITY_CONFIG,
  EXT_ENTITY_SERVICE,
  Property,
  PropertyType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { finalize, take, tap } from 'rxjs/operators';
import { INPUT_ENTIRY, INPUT_ENTITY_META } from '../../../api.consts';
import { ExtBaseViewComponent } from '../base-view/base-view.component';

@Component({
  selector: 'ext-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
})
export class ExtBasicComponent extends ExtBaseViewComponent implements OnInit {
  /*** Entity meta for the selected/new item */
  @Input(INPUT_ENTITY_META) entityMeta: EntityMeta;

  /*** Current entity*/
  @Input(INPUT_ENTIRY) entity: any;

  @Input() save: any;

  properties: Property[];
  propertyTypes = PropertyType;

  constructor(
    @Inject(EXT_API_CONFIG) protected apiConfig: ExtApiConfig,
    @Inject(EXT_ENTITY_CONFIG) public entityConfig: ExtEntityConfig,
    @Inject(EXT_ENTITY_SERVICE) protected entityService: AbstractEntityService,
    protected entityMetaService: EntityMetaService,
    protected activatedRoute: ActivatedRoute,
    public media: MediaObserver
  ) {
    super(apiConfig, entityConfig, entityService, activatedRoute, entityMetaService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  /*** save */
  public onSave(showSnackBar?: boolean): void {
    if (this.formGroup.valid) {
      this.loading = true;
      this.entityService
        .save(this.entityMeta, this.formGroup.value, false, this.originalEntity, showSnackBar)
        .pipe(
          tap((d) => this.saved.emit(d)),
          finalize(() => (this.loading = false)),
          take(1)
        )
        .subscribe();
    } else {
      this.formGroup.markAllAsTouched();
      this.loading = false;
    }
  }

  handleEntityMeta(propties: Property[]) {
    this.properties = propties;
  }
}
