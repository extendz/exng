import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtDataTableModule } from 'extendz/api';
import { ENTITY_SERVICE } from '../entity/entity.config';
import { DataTableRoutingModule } from './data-table-routing.module';
import { DataTableComponent } from './data-table.component';
import { DATA_TABLE_CONFIG, DATA_TABLE_SERVICE, ENTITY_CONFIG_T } from './data-table.config';

@NgModule({
  declarations: [DataTableComponent],
  imports: [CommonModule, DataTableRoutingModule, ExtDataTableModule.forFeature(DATA_TABLE_CONFIG)],
  providers: [DATA_TABLE_SERVICE, ENTITY_CONFIG_T, ENTITY_SERVICE],
})
export class DataTableModule {}
