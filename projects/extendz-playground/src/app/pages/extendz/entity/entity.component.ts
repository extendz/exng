import { HttpClient } from '@angular/common/http';
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

  eventBus = new Subject<EntityEvent>();

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) {
    this.activatedRoute.data.subscribe((d) => (this.data = d.extendz));
  }

  ngOnInit(): void {}

  onAction(action: Action) {
    switch (action.id) {
      case 'printDeliveryOrder':
        break;
      case 'startDelivery':
        this.http.patch('deliveryOrders/DEL-00010', { status: 'OnRoute' }).subscribe((d) => {
          this.eventBus.next({
            type: EntityEventType.ActionCompleted,
            payload: d,
          });
        });

        break;
    }
  }
}
