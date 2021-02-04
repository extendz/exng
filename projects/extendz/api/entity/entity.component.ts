import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
} from '@angular/core';
import { Action, EntityMeta } from 'extendz/core';
import { INPUT_ENTIRY, INPUT_ENTITY_META, OUTPUT_ACTION } from '../api.consts';
import { EntityViewDirective } from './entity-view.directive';
import { AbstractView } from './views/abstact-view';
import { ExtAvatarComponent } from './views/avatar/avatar.component';
import { TypeComponent } from './views/type/type.component';

@Component({
  selector: 'ext-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class ExtEntityComponent implements OnInit {
  /**
   * Entity meta for the selected/new item
   */
  @Input(INPUT_ENTITY_META) public entityMeta: EntityMeta;

  /**
   * Current entity
   */
  @Input(INPUT_ENTIRY) public entity: any;

  @Output(OUTPUT_ACTION) action: EventEmitter<Action> = new EventEmitter<Action>();

  @ViewChild(EntityViewDirective, { static: true }) view: EntityViewDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    let view = this.entityMeta.view || 'avatar';
    let component: Type<any>;
    switch (view) {
      case 'avatar':
        component = ExtAvatarComponent;
        break;
      case 'type':
        component = TypeComponent;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.view.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<AbstractView>componentRef.instance).entityMeta = this.entityMeta;
    (<AbstractView>componentRef.instance).entity = this.entity;
    (<AbstractView>componentRef.instance).action = this.action;
  }

  public handleResponse(entity: any) {}

  public handleEntityMeta(entityMeta: EntityMeta) {}
}
