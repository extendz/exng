import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtEntityModule } from 'extendz/api';
import { EntityRoutingModule } from './entity-routing.module';
import { EntityComponent } from './entity.component';
import { EntityService } from './entity.service';

@NgModule({
  declarations: [EntityComponent],
  imports: [
    CommonModule,
    EntityRoutingModule,
    // Extendz
    ExtEntityModule.forRoot(
      {
        placeholderImage: 'assets/img/placeholder.png'
      },
      EntityService
    )
  ]
})
export class EntityModule {}
