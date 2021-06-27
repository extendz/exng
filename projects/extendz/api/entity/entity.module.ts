import { ModuleWithProviders, NgModule } from '@angular/core';
import { ExtApiConfig, ExtEntityConfig, EXT_API_CONFIG, EXT_ENTITY_CONFIG } from 'extendz/core';
import { EntityViewDirective } from './entity-view.directive';
import { ExtEntityComponent } from './entity.component';
import { ExtAvatarModule } from './views/avatar/avatar.module';
import { ExtFlowModule } from './views/flow/flow.module';
import { TypeComponent } from './views/type/type.component';

@NgModule({
  declarations: [ExtEntityComponent, EntityViewDirective, TypeComponent],
  exports: [ExtEntityComponent],
  imports: [
    //
    ExtAvatarModule,
    ExtFlowModule,
  ],
})
export class ExtEntityModule {
  static forFeature(config: ExtEntityConfig): ModuleWithProviders<ExtEntityModule> {
    return {
      ngModule: ExtEntityModule,
      providers: [
        { provide: EXT_ENTITY_CONFIG, useValue: config },
        { provide: EXT_API_CONFIG, useValue: new ExtApiConfig(config.modelsJson, config.partials) },
      ],
    };
  }
}
