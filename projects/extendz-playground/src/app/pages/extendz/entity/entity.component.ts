import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action, ObjectWithLinks } from 'extendz/core';
import { EntityComponentResolverData } from './entity-component-resolver.service';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class EntityComponent implements OnInit {
  public data: EntityComponentResolverData;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe((d) => (this.data = d.extendz));
  }

  ngOnInit(): void {}

  onAction(action: Action) {}
}
