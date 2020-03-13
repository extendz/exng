import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityMeta } from '../../core/models/entity-meta';
import { EntityMetaResponse } from '../../core/models/entity-meta-response';
import { EntityMetaService } from '../../service/entity-meta/entity-meta.service';

@Component({
  selector: 'ext-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {

  @Output()
  public select: EventEmitter<EntityMeta> = new EventEmitter<EntityMeta>();

  public models$: Observable<EntityMetaResponse>;

  constructor(private entityMetaService: EntityMetaService) { }

  ngOnInit(): void {
    console.log("Get root");
    
    this.models$ = this.entityMetaService.getRoot();
  }

  /**
  * On Select a model
  * @param model selected Model
  */
  public onSelect(model: EntityMeta) {
    this.select.emit(model);
  } // onSelect()

}// class
