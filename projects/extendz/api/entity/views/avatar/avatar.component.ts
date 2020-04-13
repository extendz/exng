import { Component, Inject, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
  AbstractEntityService,
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
    @Inject(EXT_ENTITY_SERVICE) entityService: AbstractEntityService,
    public media: MediaObserver
  ) {
    super(entityService);
  }

  ngOnInit(): void {
    // avart image
    if (this.entity) {
      let urls = this.entityMeta.properties
        .filter((p: Property) => p.type === PropertyType.image)
        .map((p: Property) => this.entity[p.name]);
      this.imageUrl = urls[0];
    } else this.imageUrl = this.entityConfig.placeholderImage;
    // Call super fuction
    super.ngOnInit();
    // Avatar image is not showing
    // this.imageProperties = this.entityMeta.properties.filter(
    //   p => p.type === PropertyType.image && !p.imageMeta.avatar
    // );
  } //ngOnInit()
} // class
