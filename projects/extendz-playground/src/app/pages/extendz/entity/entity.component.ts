import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action, EntityEvent, EntityEventType } from 'extendz/core';
import { Subject } from 'rxjs';
import { EntityComponentResolverData } from './entity-component-resolver.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class EntityComponent implements OnInit {
  public data: EntityComponentResolverData;

  events = new Subject<EntityEvent>();

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe((d) => (this.data = d.extendz));
  }

  ngOnInit(): void {}

  onAction(action: Action) {
    if (action.id == 'printDeliveryOrder') {
      console.log(action.entity);
      window.print();
    }
  }
}
