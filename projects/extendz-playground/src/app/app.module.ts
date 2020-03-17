import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExtRootModule } from 'extendz/api';
import { ExtApiConfig, EXTENDZ_API_CONFIG } from 'extendz/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const extendzConfig: ExtApiConfig = {
  modelsJson: 'assets/json/models.json',
  svgIconSet: 'assets/svg/api-icons.svg'
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    //
    ExtRootModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: EXTENDZ_API_CONFIG,
      useValue: extendzConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
