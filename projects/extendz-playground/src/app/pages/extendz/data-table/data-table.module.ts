import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtDataTableModule } from 'extendz/api';
import { ExtDatatableConfig, EXT_DATA_TABLE_SERVICE } from 'extendz/core';
import { DataTableHateosService } from './data-table-hateos.service';
import { DataTableRoutingModule } from './data-table-routing.module';
import { DataTableComponent } from './data-table.component';

export const DATA_TABLE_CONFIG: ExtDatatableConfig = {
  svgIconSet: 'assets/svg/api-icons.svg',
  modelsJson: 'assets/json/models.json',
  placeholderImage: 'assets/img/placeholder.png',
  dataTableProjecion: 'dataTable',
  pageSizeOptions: [10, 20, 100, 500],
  showFirstLastButtons: true,
  defaultPageSize: 20,
};

export const DATA_TABLE_SERVICE = {
  provide: EXT_DATA_TABLE_SERVICE,
  useClass: DataTableHateosService,
};

@NgModule({
  declarations: [DataTableComponent],
  imports: [CommonModule, DataTableRoutingModule, ExtDataTableModule.forFeature(DATA_TABLE_CONFIG)],
  providers: [DATA_TABLE_SERVICE],
})
export class DataTableModule {}
