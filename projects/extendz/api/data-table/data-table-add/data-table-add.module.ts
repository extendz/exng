import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtSimpleModule } from '../../entity/views/simple/simple.module';
import { ExtDataTableAddComponent } from './data-table-add.component';

@NgModule({
  declarations: [ExtDataTableAddComponent],
  exports: [ExtDataTableAddComponent],
  imports: [
    CommonModule,
    //
    ExtPipesModule,
    ExtSimpleModule,
    //
    FlexLayoutModule,
    //
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
  ],
})
export class ExtDataTableAddModule {}
