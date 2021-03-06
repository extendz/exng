import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtSimpleModule } from '../../../entity/views/simple/simple.module';
import { ExtAddNewComponent } from './add-new.component';

@NgModule({
  declarations: [ExtAddNewComponent],
  entryComponents: [ExtAddNewComponent],
  imports: [
    CommonModule,
    ExtSimpleModule,
    ExtPipesModule,
    FlexLayoutModule,
    // Mat
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
  ],
})
export class ExtAddNewModule {}
