import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtSimpleEntityModule } from '../../core/simple-entity/simple-entity.module';
import { ExtTableEmbeddedComponent } from './table-embedded.component';

@NgModule({
  declarations: [ExtTableEmbeddedComponent],
  entryComponents: [ExtTableEmbeddedComponent],
  imports: [
    CommonModule, // Ext
    ExtSimpleEntityModule,
    FlexLayoutModule,
    ExtPipesModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatTabsModule,
  ],
})
export class ExtTableEmbeddedModule {}
