import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ExtApiConfig,
  ExtDatatableConfig,
  EXT_API_CONFIG,
  EXT_DATA_TABLE_CONFIG,
} from 'extendz/core';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtBasicTableModule } from '../basic-table/basic-table.module';
import { ExtDataTableAddModule } from './data-table-add/data-table-add.module';
import { ExtDataTableInlinesModule } from './data-table-inlines/data-table-inlines.module';
import { ExtDataTableComponent } from './data-table.component';

@NgModule({
  declarations: [ExtDataTableComponent],
  exports: [ExtDataTableComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    // Ext
    ExtPipesModule,
    ExtDataTableAddModule,
    ExtBasicTableModule,
    ExtDataTableInlinesModule,
    // CDK
    OverlayModule,
    // Mat
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class ExtDataTableModule {
  static forFeature(config: ExtDatatableConfig): ModuleWithProviders<ExtDataTableModule> {
    return {
      ngModule: ExtDataTableModule,
      providers: [
        { provide: EXT_API_CONFIG, useValue: new ExtApiConfig(config.modelsJson) },
        { provide: EXT_DATA_TABLE_CONFIG, useValue: config },
      ],
    };
  }
}
