import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
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
    // Mat
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
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
