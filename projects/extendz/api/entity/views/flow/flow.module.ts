import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtImageModule } from '../../../image/image.module';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtEmbeddedModule } from '../../../embedded/embedded.module';
import { ExtInputTableModule } from '../../../input-table/input-table.module';
import { ExtMoneyModule } from '../../../money/money.module';
import { ExtSelectModule } from '../../../select/select.module';
import { FlowComponent } from './flow.component';

@NgModule({
  declarations: [FlowComponent],
  exports: [FlowComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    ExtInputTableModule,
    ExtSelectModule,
    ExtPipesModule,
    ExtMoneyModule,
    ExtImageModule,
    ExtEmbeddedModule,
    // Mat
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatDatepickerModule,
  ],
})
export class ExtFlowModule {}
