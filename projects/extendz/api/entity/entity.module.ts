import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { ExtEntityConfig, EXT_ENTITY_CONFIG, EXT_ENTITY_SERVICE } from 'extendz/core';
import { EntityViewDirective } from './entity-view.directive';
import { ExtEntityComponent } from './entity.component';
import { ExtAvatarModule } from './views/avatar/avatar.module';
import { TypeComponent } from './views/type/type.component';

@NgModule({
  declarations: [ExtEntityComponent, EntityViewDirective, TypeComponent],
  exports: [ExtEntityComponent],
  imports: [
    //
    ExtAvatarModule
  ]
})
export class ExtEntityModule {
  static forRoot(config: ExtEntityConfig, service: Type<any>): ModuleWithProviders<ExtEntityModule> {
    return {
      ngModule: ExtEntityModule,
      providers: [
        { provide: EXT_ENTITY_CONFIG, useValue: config },
        {
          provide: EXT_ENTITY_SERVICE,
          useClass: service
        }
      ]
    };
  } // forRoot()
}
