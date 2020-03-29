import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtDataTableModule } from 'extendz/api';
import { DataTableRoutingModule } from './data-table-routing.module';
import { DataTableComponent } from './data-table.component';
import { DataTableService } from './data-table.service';

@NgModule({
  declarations: [DataTableComponent],
  imports: [
    CommonModule,
    DataTableRoutingModule,
    ExtDataTableModule.forRoot(
      {
        pageSizeOptions: [10, 20, 100, 500],
        showFirstLastButtons: true,
        defaultPageSize:20,
      },
      DataTableService
    )
  ]
})
export class DataTableModule {}
