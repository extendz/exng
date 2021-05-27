import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AbstractDataTableService,
  EntityMeta,
  ExtApiConfig,
  ExtDatatableConfig,
  EXT_API_CONFIG,
  EXT_DATA_TABLE_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  Property,
} from 'extendz/core';
import { Subscription } from 'rxjs';
import { catchError, debounceTime, finalize, map, mergeMap, take, tap } from 'rxjs/operators';
import { INPUT_ENTITY_META } from '../api.consts';

export const rowsAnimation = trigger('rowsAnimation', [
  transition('void => *', [
    style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
    sequence([
      animate(
        '.35s ease',
        style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none' })
      ),
      animate('.35s ease', style({ height: '*', opacity: 1, transform: 'translateX(0)' })),
    ]),
  ]),
]);

@Component({
  selector: 'ext-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  animations: [rowsAnimation],
})
export class ExtDataTableComponent implements OnInit {
  /*** Entity meta data   */
  @Input() entityMeta: EntityMeta;

  /*** Data to be shown */
  @Input() data: any[] = [];

  /*** Selected Items */
  @Input() selected: any[];

  /*** Multi select in the table enable/dissable */
  @Input() multiSelect: boolean;

  /***
   * Allow to create new entity
   */
  @Input() public allowNew: boolean;
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
   * Selection model
   */
  public selection: SelectionModel<any>;
  /***
   * loading indicator
   */
  public loading: boolean = false;
  /***
   * Default search placeholder
   */
  public searchField: string;
  /***
   *
   */
  public searchFormGroup: FormGroup;
  /***
   *
   */
  private searchSubscription: Subscription;
  /***
   *
   */
  private searchParams: HttpParams;

  httpError: HttpErrorResponse;

  constructor(
    @Inject(EXT_API_CONFIG) public config: ExtApiConfig,
    @Inject(EXT_DATA_TABLE_CONFIG) public dataTableConfig: ExtDatatableConfig,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    private formBuilder: FormBuilder,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    const url = this.sanitizer.bypassSecurityTrustResourceUrl(this.dataTableConfig.svgIconSet);
    this.iconRegistry.addSvgIconSetInNamespace('api-root', url);
    this.page = { pageIndex: 0, pageSize: dataTableConfig.defaultPageSize, length: 0 };
    this.searchFormGroup = this.formBuilder.group({
      text: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchFormGroup.valueChanges
      .pipe(
        debounceTime(500),
        mergeMap((v) => {
          this.searchParams = new HttpParams();
          this.searchParams = this.searchParams.append(this.searchField, v.text);
          return this.getData(this.entityMeta, this.page).pipe(take(1));
        })
      )
      .subscribe();
  } //ngOnInit()

  ngOnDestroy(): void {
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[INPUT_ENTITY_META] && changes[INPUT_ENTITY_META].currentValue) {
      if (this.multiSelect === undefined) this.multiSelect = true;
      this.selection = new SelectionModel<any>(this.multiSelect, []);

      let properties = Object.values(this.entityMeta.properties);

      // Set search
      if (this.entityMeta.search) this.searchField = this.entityMeta.search.default;
      else this.searchField = properties[0].name;

      // Get the table headers based on the projection

      let projections = this.entityMeta.projections;

      if (projections && projections[this.dataTableConfig.dataTableProjecion])
        properties = this.entityMeta.projections[this.dataTableConfig.dataTableProjecion];

      // Get only the name since that is diplayed
      this.properties = properties;
      this.allColumns = ['select', ...this.properties.map((p) => p.name)];
      if (!this.allowNew) this.allColumns = [...this.allColumns, 'edit'];
      this.getData(this.entityMeta, this.page).subscribe();
    }
  } // ngOnChanges()

  private getData(entityMeta: EntityMeta, pageEvent: PageEvent) {
    this.loading = true;
    return this.dataTableService.getData(entityMeta, this.searchParams, pageEvent).pipe(
      take(1),
      tap((p) => (this.page = p.page)),
      map((d) => d.data),
      tap((d) => (this.data = d)),
      catchError((e: HttpErrorResponse) => {
        this.httpError = e;
        throw e;
      }),
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
        mergeMap((_) => this.getData(this.entityMeta, this.page)),
        finalize(() => this.selection.clear())
      )
      .subscribe();
  }

  /*** User select an existing entity to edit */
  public editRow(item: any) {
    this.select.emit(item);
  }

  /*** Create a new entity */
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
    const numRows = this.page.length;
    return numSelected === numRows;
  } // isAllSelected()
  /***
   *  Selects all rows if they are not all selected; otherwise clear selection.
   */
  public masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.forEach((row) => this.selection.select(row));
  } // masterToggle()
} // class
