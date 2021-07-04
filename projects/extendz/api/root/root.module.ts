import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExtApiConfig, ExtRootConfig, EXT_API_CONFIG, EXT_ROOT_CONFIG } from 'extendz/core';
import { ExtPipesModule } from 'extendz/pipes';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [RootComponent],
  exports: [RootComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    // Ext
    ExtPipesModule,
    // Material
    MatCardModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
  ],
})
export class ExtRootModule {
  static forFeature(config: ExtRootConfig): ModuleWithProviders<ExtRootModule> {
    return {
      ngModule: ExtRootModule,
      providers: [
        { provide: EXT_ROOT_CONFIG, useValue: config },
        {
          provide: EXT_API_CONFIG,
          useValue: new ExtApiConfig(config.modelsJson, config.partials, config.cache),
        },
      ],
    };
  }
}
