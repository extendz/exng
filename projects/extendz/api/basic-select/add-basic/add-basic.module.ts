import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtBasicModule } from '../../entity/views/basic/basic.module';
import { AddBasicComponent } from './add-basic.component';

@NgModule({
  declarations: [AddBasicComponent],
  exports: [AddBasicComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ExtPipesModule,
    ExtBasicModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
  ],
})
export class AddBasicModule {}
