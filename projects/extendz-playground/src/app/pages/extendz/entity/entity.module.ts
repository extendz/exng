import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtEntityModule } from 'extendz/api';
import { EXT_DATA_TABLE_CONFIG } from 'extendz/core';
import { DATA_TABLE_CONFIG, DATA_TABLE_SERVICE } from '../data-table/data-table.config';
import { EntityRoutingModule } from './entity-routing.module';
import { EntityComponent } from './entity.component';
import { ENTITY_CONFIG, ENTITY_SERVICE } from './entity.config';

@NgModule({
  declarations: [EntityComponent],
  imports: [
    CommonModule,
    EntityRoutingModule,
    // Ext
    ExtEntityModule.forFeature(ENTITY_CONFIG),
  ],
  providers: [
    DATA_TABLE_SERVICE,
    ENTITY_SERVICE,
    { provide: EXT_DATA_TABLE_CONFIG, useValue: DATA_TABLE_CONFIG },
  ],
})
export class EntityModule {}
