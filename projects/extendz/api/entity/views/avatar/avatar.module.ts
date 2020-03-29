import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ExtPipesModule } from 'extendz/pipes';
import { ExtEmbeddedModule } from '../../../embedded/embedded.module';
import { ExtSelectModule } from '../../../select/select.module';
import { ExtAvatarComponent } from './avatar.component';

@NgModule({
  declarations: [ExtAvatarComponent],
  exports: [ExtAvatarComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    // Extendz
    ExtPipesModule,
    ExtEmbeddedModule,
    ExtSelectModule,
    // Mat
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatMomentDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ]
})
export class ExtAvatarModule {}
