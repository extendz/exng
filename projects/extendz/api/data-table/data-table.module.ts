import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExtDatatableConfig, EXT_DATA_TABLE_CONFIG, EXT_DATA_TABLE_SERVICE } from 'extendz/core';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtDataTableComponent } from './data-table.component';

@NgModule({
  declarations: [ExtDataTableComponent],
  exports: [ExtDataTableComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
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
    MatTooltipModule
  ]
})
export class ExtDataTableModule {
  static forRoot(config: ExtDatatableConfig, service: Type<any>): ModuleWithProviders {
    return {
      ngModule: ExtDataTableModule,
      providers: [
        { provide: EXT_DATA_TABLE_CONFIG, useValue: config },
        {
          provide: EXT_DATA_TABLE_SERVICE,
          useClass: service
        }
      ]
    };
  } // forRoot()
} // class
