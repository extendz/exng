import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMeta, ExtApiConfig, EXTENDZ_API_CONFIG } from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { flatMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  public entityMeta: EntityMeta;

  constructor(
    private activatedRoute: ActivatedRoute,
    private entityMetaService: EntityMetaService,
    private router: Router,
    @Inject(EXTENDZ_API_CONFIG) public config: ExtApiConfig
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(p => p.model),
        flatMap(name => this.entityMetaService.getModel(name)),
        tap(model => (this.entityMeta = model))
        // flatMap(model => this.getData(model))
      )
      .subscribe();
  } // ngOnInit()

  public onSelectEntity(entity: any) {
    let id: string = 'new';
    if (entity) id = entity[this.config.idFeild];
    this.router.navigate([id], { relativeTo: this.activatedRoute });
  } // onSelectEntity()
} // class
