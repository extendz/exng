import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtImageModule } from '../image/image.module';
import { ExtMoneyModule } from '../money/money.module';
import { MatrixComponent } from './matrix.component';

@NgModule({
  declarations: [MatrixComponent],
  exports: [MatrixComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    //
    ExtPipesModule,
    ExtImageModule,
    ExtMoneyModule,
    //
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatTableModule,
    MatTooltipModule,
  ],
})
export class ExtMatrixModule {}
