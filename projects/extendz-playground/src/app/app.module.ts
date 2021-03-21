import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { IndexedDBModule } from '../shared/indexdb/indexed-db.module';
import { ApiInterceptorService, API_TOKEN } from '../shared/interceptors/api-interceptor.services';
import { fakeBackendProvider } from '../shared/interceptors/fake-backend-provider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Mat
    MatSnackBarModule,
    IndexedDBModule.forRoot([
      {
        name: 'extendz',
        stores: [
          { name: 'customers' },
          { name: 'brands' },
          { name: 'prices' },
          { name: 'owners' },
          { name: 'shops' },
          { name: 'stockKeepingUnits' },
          { name: 'products' },
          { name: 'currencies' },
        ],
      },
    ]),
  ],
  providers: [
    { provide: API_TOKEN, useValue: environment.basePath },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
    // fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
