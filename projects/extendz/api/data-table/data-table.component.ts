import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  AbstractDataTableService,
  EntityMeta,
  ExtApiConfig,
  ExtDatatableConfig,
  EXTENDZ_API_CONFIG,
  EXT_DATA_TABLE_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  Property
} from 'extendz/core';
import { finalize, flatMap, map, take, tap } from 'rxjs/operators';
import { INPUT_ENTITY_META } from '../api.consts';

@Component({
  selector: 'ext-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class ExtDataTableComponent implements OnInit {
  /***
   * Entity meta data
   */
  @Input() public entityMeta: EntityMeta;

  /***
   * Data to be shown
   */
  @Input() public data: any[] = [];

  /***
   * Selected Items
   */
  @Input() public selected: any[];

  /***
   * Multi select in the table enable/dissable
   */
  @Input() public multiSelect: boolean = true;
  /***
   * Selection change event
   */
  @Output() public selectedChange: EventEmitter<string[]> = new EventEmitter<any[]>();
  /***
   * Page change
   */
  @Output('page') public pageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  /***
   * Selected value
   */
  @Output() public select: EventEmitter<any> = new EventEmitter<any>();
  /***
   * Columns that based on the Entity meta model. It take propery/projection name only here.
   */
  public properties: Property[];

  /***
   * All the columns including selec,entity metal model,edit
   */
  public allColumns: string[];

  /***
   * Pagination data
   */
  public page: PageEvent;

  /***
   *
   */
  public selection: SelectionModel<object>;

  public loading: boolean = false;

  constructor(
    @Inject(EXTENDZ_API_CONFIG) public config: ExtApiConfig,
    @Inject(EXT_DATA_TABLE_CONFIG) public dataTableConfig: ExtDatatableConfig,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService
  ) {
    this.page = { pageIndex: 1, pageSize: dataTableConfig.defaultPageSize, length: 0 };
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[INPUT_ENTITY_META] && changes[INPUT_ENTITY_META].currentValue) {
      this.selection = new SelectionModel<object>(this.multiSelect, []);

      // Get the table headers based on the projection
      let properties = this.entityMeta.properties;
      let projections = this.entityMeta.projections;

      if (projections && projections[this.config.dataTableProjecion])
        properties = this.entityMeta.projections[this.config.dataTableProjecion];

      // Get only the name since that is diplayed
      this.properties = properties;
      this.allColumns = ['select', ...this.properties.map(p => p.name), 'edit'];
      // console.log(this.entityMeta);
      this.getData(this.entityMeta, this.page).subscribe();
    }
  } // ngOnChanges()

  private getData(entityMeta: EntityMeta, pageEvent: PageEvent) {
    this.loading = true;
    return this.dataTableService.getData(entityMeta, pageEvent).pipe(
      take(1),
      tap(pagedData => (this.page = pagedData.page)),
      map(d => d.data),
      tap(d => (this.data = d)),
      finalize(() => (this.loading = false))
    );
  } //getData()

  /***
   * Delete selected items
   */
  public onDelete() {
    this.dataTableService
      .delete(this.entityMeta, this.selection.selected)
      .pipe(
        flatMap(d => this.getData(this.entityMeta, this.page)),
        finalize(() => {
          this.selection.clear();
        })
      )
      .subscribe();
  } //onDelete()
  /***
   *
   */
  public editRow(item: any) {
    this.select.emit(item);
  } // editRow()

  /***
   * Create a new entity
   */
  public onNew() {
    this.select.emit(null);
  }

  /***
   *
   */
  public onPage(pageEvent: PageEvent) {
    this.pageChange.emit(pageEvent);
    this.getData(this.entityMeta, pageEvent).subscribe();
  }

  /***
   *
   */
  public selectionChange() {
    this.selected = this.selection.selected;
    this.selectedChange.emit(this.selected);
  }

  /***
   *
   */
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.page.pageSize;
    return numSelected === numRows;
  } // isAllSelected()

  /***
   *  Selects all rows if they are not all selected; otherwise clear selection.
   */
  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.forEach(row => this.selection.select(row[this.config.idFeild]));
  } // masterToggle()
} // class
