import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtApiConfig, EXTENDZ_API_CONFIG, EXT_DATA_TABLE_SERVICE } from 'extendz/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fakeBackendProvider } from './services/fake-backend.interceptor';
import { DataTableService } from './pages/extendz/data-table/data-table.service';

const extendzConfig: ExtApiConfig = {
  modelsJson: 'assets/json/models.json',
  svgIconSet: 'assets/svg/api-icons.svg',
  dataTableProjecion: 'dataTable',
  idFeild: 'id',
  snackBarDuration: 3000,
  dateFormat: 'yyyy/MM/dd'
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, //
    MatSnackBarModule
  ],
  providers: [
    {
      provide: EXTENDZ_API_CONFIG,
      useValue: extendzConfig
    },
    {
      provide: EXT_DATA_TABLE_SERVICE,
      useClass: DataTableService
    },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
