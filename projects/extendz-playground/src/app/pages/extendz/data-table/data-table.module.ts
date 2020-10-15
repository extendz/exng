import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtDataTableModule } from 'extendz/api';
import { DataTableRoutingModule } from './data-table-routing.module';
import { DataTableComponent } from './data-table.component';

@NgModule({
  declarations: [DataTableComponent],
  imports: [CommonModule, DataTableRoutingModule, ExtDataTableModule]
})
export class DataTableModule {}
