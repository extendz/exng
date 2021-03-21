import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtEntityModule } from 'extendz/api';
import { EXT_DATA_TABLE_CONFIG, EXT_ENTITY_SERVICE } from 'extendz/core';
import { DATA_TABLE_CONFIG, DATA_TABLE_SERVICE } from '../data-table/data-table.module';
import { EntityRoutingModule } from './entity-routing.module';
import { EntityComponent } from './entity.component';
import { EntityService } from './entity.service';

@NgModule({
  declarations: [EntityComponent],
  imports: [
    CommonModule,
    EntityRoutingModule,
    // Ext
    ExtEntityModule.forFeature({
      svgIconSet: 'assets/svg/api-icons.svg',
      modelsJson: 'assets/json/models.json',
      placeholderImage: 'assets/img/placeholder.png',
      currency: {
        model: 'currency',
        defaultCurrency: 'LKR',
      },
      idFeild: '_links.self.href',
    }),
  ],
  providers: [
    {
      provide: EXT_ENTITY_SERVICE,
      useClass: EntityService,
    },
    DATA_TABLE_SERVICE,
    { provide: EXT_DATA_TABLE_CONFIG, useValue: DATA_TABLE_CONFIG },
  ],
})
export class EntityModule {}
