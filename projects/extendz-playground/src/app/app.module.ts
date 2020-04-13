import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ExtApiConfig,
  EXTENDZ_API_CONFIG,
  EXT_DATA_TABLE_CONFIG,
  EXT_DATA_TABLE_SERVICE,
} from 'extendz/core';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTableHateosService } from './pages/extendz/data-table/data-table-hateos.service';
import { ApiInterceptorService, API_TOKEN } from './services/api-interceptor.service';

const extendzConfig: ExtApiConfig = {
  modelsJson: 'assets/json/models.json',
  svgIconSet: 'assets/svg/api-icons.svg',
  dataTableProjecion: 'dataTable',
  idFeild: '_links.self.href',
  snackBarDuration: 3000,
  dateFormat: 'yyyy/MM/dd',
};

const extendzDataTable = {
  pageSizeOptions: [10, 20, 100, 500],
  showFirstLastButtons: true,
  defaultPageSize: 20,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Mat
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: EXTENDZ_API_CONFIG,
      useValue: extendzConfig,
    },
    {
      provide: EXT_DATA_TABLE_SERVICE,
      useClass: DataTableHateosService,
    },
    { provide: EXT_DATA_TABLE_CONFIG, useValue: extendzDataTable },

    { provide: API_TOKEN, useValue: environment.basePath },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
