import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ExtDirectvicesModule } from 'extendz/directive';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtEmbeddedModule } from '../../../embedded/embedded.module';
import { ExtImageModule } from '../../../image/image.module';
import { ExtInputTableModule } from '../../../input-table/input-table.module';
import { InputsProModule } from '../../../inputs-pro/inputs-pro.module';
import { ExtInputsModule } from '../../../inputs/inputs.module';
import { ExtMoneyModule } from '../../../money/money.module';
import { ExtPhoneModule } from '../../../phone/phone.module';
import { ExtSelectModule } from '../../../select/select.module';
import { ExtUnitModule } from '../../../unit/unit.module';
import { FlowComponent } from './flow.component';

@NgModule({
  declarations: [FlowComponent],
  exports: [FlowComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    // ext
    ExtPipesModule,
    ExtDirectvicesModule,
    ExtInputTableModule,
    ExtPhoneModule,
    ExtUnitModule,
    ExtSelectModule,
    ExtMoneyModule,
    ExtImageModule,
    ExtEmbeddedModule,
    ExtInputsModule,
    InputsProModule,
    // Mat
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,

    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
  ],
})
export class ExtFlowModule {}
