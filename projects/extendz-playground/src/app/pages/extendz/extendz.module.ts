import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtendzRoutingModule } from './extendz-routing.module';
import { ExtendzComponent } from './extendz.component';

@NgModule({
  declarations: [ExtendzComponent],
  imports: [CommonModule, ExtendzRoutingModule]
})
export class ExtendzModule {}
