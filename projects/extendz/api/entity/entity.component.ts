import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
} from '@angular/core';
import { Params } from '@angular/router';
import { Action, EntityEvent, EntityMeta } from 'extendz/core';
import { Subject } from 'rxjs';
import {
  EVENTS_ACTION,
  EVENTS_PARAMS,
  INPUT_ENTIRY,
  INPUT_ENTITY_META,
  INPUT_PARAMS,
  OUTPUT_ACTION,
} from '../api.consts';
import { EntityViewDirective } from './entity-view.directive';
import { AbstractView } from './views/abstact-view';
import { ExtAvatarComponent } from './views/avatar/avatar.component';
import { FlowComponent } from './views/flow/flow.component';
import { TypeComponent } from './views/type/type.component';

@Component({
  selector: 'ext-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class ExtEntityComponent implements OnInit, OnChanges {
  /*** Entity meta for the selected/new item */
  @Input(INPUT_ENTITY_META) entityMeta: EntityMeta;

  /*** Current entity */
  @Input(INPUT_ENTIRY) entity: any;

  /*** Parameters to start with */
  @Input(INPUT_PARAMS) params: Params;

  @Input(EVENTS_PARAMS) events: Subject<EntityEvent>;

  @Output(EVENTS_ACTION) eventsChange = new EventEmitter<Subject<EntityEvent>>();

  @Output(OUTPUT_ACTION) action = new EventEmitter<Action>();

  @ViewChild(EntityViewDirective, { static: true }) view: EntityViewDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnChanges(changes: SimpleChanges): void {
    let view = this.entityMeta?.view || 'flow';
    let component: Type<any>;
    switch (view) {
      case 'avatar':
        component = ExtAvatarComponent;
        break;
      case 'type':
        component = TypeComponent;
      case 'flow':
        component = FlowComponent;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.view.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<AbstractView>componentRef.instance).entityMeta = this.entityMeta;
    (<AbstractView>componentRef.instance).entity = this.entity;
    (<AbstractView>componentRef.instance).action = this.action;
    (<AbstractView>componentRef.instance).events = this.events;
    (<AbstractView>componentRef.instance).eventsChange = this.eventsChange;
    (<AbstractView>componentRef.instance).params = this.params;
  }

  ngOnInit(): void {}

  public handleResponse(entity: any) {}

  public handleEntityMeta(entityMeta: EntityMeta) {}
}
