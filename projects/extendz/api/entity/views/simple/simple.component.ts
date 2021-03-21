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
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { INPUT_ENTIRY, INPUT_ENTITY_META } from '../../../api.consts';
import { ExtBaseViewComponent } from '../base-view/base-view.component';

@Component({
  selector: 'ext-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
})
export class SimpleComponent extends ExtBaseViewComponent implements OnInit {
  /*** Entity meta for the selected/new item */
  @Input(INPUT_ENTITY_META) entityMeta: EntityMeta;

  /*** Current entity*/
  @Input(INPUT_ENTIRY) entity: any;

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
    // Call super function
    super.ngOnInit();
  }
}
