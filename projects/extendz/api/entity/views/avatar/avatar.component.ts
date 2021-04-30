import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { EntityMetaService } from 'extendz/service';
import {
  AbstractEntityService,
  ExtApiConfig,
  ExtEntityConfig,
  EXT_API_CONFIG,
  EXT_ENTITY_CONFIG,
  EXT_ENTITY_SERVICE,
  Property,
  PropertyType,
} from 'extendz/core';
import { AbstractView } from '../abstact-view';
import { ExtBaseViewComponent } from '../base-view/base-view.component';

@Component({
  selector: 'ext-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class ExtAvatarComponent extends ExtBaseViewComponent implements OnInit, AbstractView {
  /***
   *
   */
  public imageUrl: string;

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
    // avart image
    const properties = Object.values(this.entityMeta.properties);
    if (this.entity) {
      let urls = properties
        .filter((p: Property) => p.type === PropertyType.image)
        .map((p: Property) => this.entity[p.name]);
      this.imageUrl = urls[0];
    } else this.imageUrl = this.entityConfig.placeholderImage;
    // Call super function
    super.ngOnInit();
  } //ngOnInit()
} // class
