import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractEntityService,
  ExtApiConfig,
  EXTENDZ_API_CONFIG,
  ExtEntityConfig,
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
    @Inject(EXT_ENTITY_CONFIG) private entityConfig: ExtEntityConfig,
    @Inject(EXTENDZ_API_CONFIG) apiConfig: ExtApiConfig,
    @Inject(EXT_ENTITY_SERVICE) entityService: AbstractEntityService,
    activatedRoute: ActivatedRoute,
    public media: MediaObserver
  ) {
    super(apiConfig, entityService, activatedRoute);
  }

  ngOnInit(): void {
    // avart image
    if (this.entity) {
      let urls = this.entityMeta.properties
        .filter((p: Property) => p.type === PropertyType.image)
        .map((p: Property) => this.entity[p.name]);
      this.imageUrl = urls[0];
    } else this.imageUrl = this.entityConfig.placeholderImage;
    // Call super function
    super.ngOnInit();
  } //ngOnInit()
} // class
