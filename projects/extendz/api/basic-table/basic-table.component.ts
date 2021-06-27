import { HttpParams } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  AbstractDataTableService,
  EntityMeta,
  ExpandFilter,
  ExtDatatableConfig,
  EXT_DATA_TABLE_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  Property,
  PropertyType,
} from 'extendz/core';
import { finalize, map, take, tap } from 'rxjs/operators';
import { INPUT_ENTITY_META } from '../api.consts';

@Component({
  selector: 'ext-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss'],
})
export class BasicTableComponent implements OnChanges {
  /*** Data to display */
  data: any[] = [];

  /*** Entity meta data   */
  @Input() entityMeta: EntityMeta;
  /*** Filter for api from parent entity */
  @Input() filter: ExpandFilter;
  @Output() done = new EventEmitter();

  page: PageEvent;

  properties: Property[];
  allColumns: string[];
  loading: boolean = false;

  params: HttpParams = new HttpParams();

  constructor(
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    @Inject(EXT_DATA_TABLE_CONFIG) public dataTableConfig: ExtDatatableConfig
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[INPUT_ENTITY_META] && changes[INPUT_ENTITY_META].currentValue) {
      this.properties = Object.values(this.entityMeta.properties);
      // iggnore
      this.properties = this.properties.filter((p) => p.type != PropertyType.spacer);

      const projection = this.entityMeta.config?.expand?.projection;
      if (projection) {
        // Get the table headers based on the projection
        let projections = this.entityMeta.projections;
        if (projections && projections[projection])
          this.properties = this.entityMeta.projections[projection];

        this.params = this.params.append('projection', projection);
      }
      if (this.filter) this.params = this.params.append(this.filter.key, this.filter.value);

      this.allColumns = this.properties.map((p) => p.name);
      this.getData(this.entityMeta, this.page).subscribe();
    }
  }

  private getData(entityMeta: EntityMeta, pageEvent: PageEvent) {
    this.loading = true;
    return this.dataTableService.getData(entityMeta, this.params, pageEvent).pipe(
      take(1),
      tap((p) => (this.page = p.page)),
      map((d) => d.data),
      tap((d) => (this.data = d)),
      finalize(() => {
        this.loading = false;
        this.done.emit(null);
      })
    );
  } //getData()
}
