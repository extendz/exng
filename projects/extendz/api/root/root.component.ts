import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EntityMeta, EntityMetaResponse } from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ext-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  @Output()
  public select: EventEmitter<EntityMeta> = new EventEmitter<EntityMeta>();

  public models$: Observable<EntityMetaResponse>;

  constructor(private entityMetaService: EntityMetaService) {}

  ngOnInit(): void {
    this.models$ = this.entityMetaService.getRoot();
  }

  /**
   * On Select a model
   * @param model selected Model
   */
  public onSelect(model: EntityMeta) {
    this.select.emit(model);
  } // onSelect()
} // class
