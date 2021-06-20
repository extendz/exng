import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
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
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatMenuTrigger } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AbstractDataTableService,
  AbstractEntityService,
  EntityMeta,
  Expand,
  ExpandFilter,
  ExtApiConfig,
  ExtDatatableConfig,
  ExtEntityConfig,
  EXT_API_CONFIG,
  EXT_DATA_TABLE_CONFIG,
  EXT_DATA_TABLE_SERVICE,
  EXT_ENTITY_CONFIG,
  EXT_ENTITY_SERVICE,
  getId,
  getValueByField,
  Property,
  PropertyType,
} from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  finalize,
  map,
  mergeMap,
  take,
  tap,
} from 'rxjs/operators';
import { INPUT_ENTITY_META } from '../api.consts';
import { ExtDataTableAddComponent } from './data-table-add/data-table-add.component';

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

export const expandAnimation = trigger('detailExpand', [
  state('collapsed', style({ height: '0px', minHeight: '0' })),
  state('expanded', style({ height: '*' })),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

@Component({
  selector: 'ext-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  animations: [rowsAnimation, expandAnimation],
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

  /*** Search form group */
  searchFormGroup: FormGroup;
  /***
   *
   */
  private searchSubscription: Subscription;
  /***
   *
   */
  private searchParams: HttpParams;

  trackItem: TrackByFunction<any> = (i, property) => property.key;

  httpError: HttpErrorResponse;
  expandedElement: any | null;

  @ViewChild('expandMenuButton', { read: MatMenuTrigger, static: false })
  expandMenu: MatMenuTrigger;

  // TODO model this
  expands: any;
  expandedEntityMeta: EntityMeta;
  expandFilter: ExpandFilter;

  isPopoverOpen = false;

  constructor(
    @Inject(EXT_API_CONFIG) public config: ExtApiConfig,
    @Inject(EXT_ENTITY_CONFIG) public entityConfig: ExtEntityConfig,
    @Inject(EXT_DATA_TABLE_CONFIG) public dataTableConfig: ExtDatatableConfig,
    @Inject(EXT_DATA_TABLE_SERVICE) public dataTableService: AbstractDataTableService,
    @Inject(EXT_ENTITY_SERVICE) protected entityService: AbstractEntityService,
    protected entityMetaService: EntityMetaService,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
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

      // iggnore
      properties = properties.filter((p) => p.type != PropertyType.spacer);

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

      // -------- Expands --------
      this.expands = this.entityMeta.config?.dataTable?.expands;
      // if expands are enabled then show arrow
      if (this.expands?.length > 0) this.allColumns = [...this.allColumns, 'expand'];

      this.getData(this.entityMeta, this.page).subscribe();
    }
  } // ngOnChanges()

  expandComplete: boolean;

  onExpand(row: any, expand?: Expand) {
    row._loading = true;
    if (this.expandedElement) this.expandedElement._loading = false;

    const expandingProperty = this.entityMeta.properties[expand.property.name];
    // const filter =
    const idField = getValueByField(this.entityConfig.idFeild, row);
    const id = getId(idField);
    this.expandFilter = { key: expand?.filter?.key, value: id };

    if (expandingProperty) {
      this.entityMetaService
        .getModel(expandingProperty.reference)
        .pipe(
          take(1),
          tap((em) => (this.expandedEntityMeta = em))
        )
        .subscribe((_) => {
          if (this.expands?.length > 1) {
            this.expandMenu.openMenu();
          } else this.expandedElement = this.expandedElement === row ? null : row;
        });
    } else {
      this.matSnackBar.open('Expanded property not found');
    }
  }

  onExpandDone() {
    this.expandedElement._loading = false;
  }

  onRowChange(entity: any, property: Property, original: any) {
    this.entityService.save(this.entityMeta, entity, false, original, true).subscribe();
  }

  onDateClick(entity: any, event: MouseEvent) {
    event.preventDefault();
    console.log(event);
  }

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
   * When user change the default seach field
   */
  onSeachField(column: string) {
    this.searchField = column;
  }

  onSeachFieldPropery(property: Property, name: string) {
    this.searchField = `${name}.${property.name}`;
  }

  /***
   * For seaching on the sub levels in seach filter
   */
  getProperty(parentProperty: string) {
    if (!parentProperty) return null;
    return this.entityMetaService.getModel(parentProperty).pipe(
      filter((x) => x != null && x.properties != null),
      map((d) => d.properties),
      take(1)
    );
  }

  /***
   * Delete selected items
   */
  onDelete() {
    this.dataTableService
      .delete(this.entityMeta, this.selection.selected)
      .pipe(
        mergeMap((_) => this.getData(this.entityMeta, this.page)),
        finalize(() => this.selection.clear())
      )
      .subscribe();
  }

  /*** User select an existing entity to edit */
  editRow(item: any) {
    this.select.emit(item);
  }

  /*** Create a new entity */
  onNew() {
    console.log(this.entityMeta);
    if (this.entityMeta?.config?.dataTable?.simpleAdd) {
      let dialogRef = this.matDialog.open(ExtDataTableAddComponent, {
        data: this.entityMeta,
        panelClass: 'ext-advance-select',
        width: '90vw',
      });

      dialogRef
        .afterClosed()
        .pipe(
          take(1),
          filter((r) => r != undefined),
          mergeMap((_) => this.getData(this.entityMeta, this.page))
        )
        .subscribe();
    } else this.select.emit(null);
  }

  /***
   *
   */
  onPage(pageEvent: PageEvent) {
    this.pageChange.emit(pageEvent);
    this.getData(this.entityMeta, pageEvent).subscribe();
  }
  /***
   *
   */
  selectionChange() {
    this.selected = this.selection.selected;
    this.selectedChange.emit(this.selected);
  }

  /***
   *
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.page.length;
    return numSelected === numRows;
  }

  /***
   *  Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.forEach((row) => this.selection.select(row));
  } // masterToggle()
} // class
