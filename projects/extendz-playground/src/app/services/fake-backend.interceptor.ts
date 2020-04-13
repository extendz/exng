import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedData } from 'extendz/core/public_api';
import * as faker from 'faker';
import { Observable, of } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

const ownerIdReg = new RegExp(
  /owners\/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
);

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body, params } = request;
    console.log(url, params.toString());

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(10))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('owners') && method === 'GET':
          return of(new HttpResponse({ status: 200, body: make10Users(params) }));
        case url.match(ownerIdReg) && method === 'GET':
          return of(new HttpResponse({ status: 200, body: makeAnOwener(params) }));
        default:
          return next.handle(request);
      } // switch
    } // handleRoute()

    function makeAnOwener(params: HttpParams) {
      let id = params.get('id');

      let e = {
        id,
        email: faker.internet.email(),
        profilePicture: faker.image.avatar(),
        createdDate: faker.date.recent(),
        firstName: faker.name.firstName(),
        expense: {
          reason: faker.lorem.sentence(),
          date: faker.date.recent(),
          amount: faker.finance.amount()
        }
      };
      return e;
    }

    function make10Users(params: HttpParams) {
      let pageSize = +params.get('pageSize');
      if (!pageSize) pageSize = 10;

      let owners = [];
      for (let index = 0; index < pageSize; index++) {
        let e = {
          id: faker.random.uuid(),
          email: faker.internet.email(),
          profilePicture: faker.image.avatar(),
          createdDate: faker.date.recent()
        };
        owners.push(e);
      }

      let pagedData: PagedData = {
        data: owners,
        page: {
          pageIndex: +params.get('pageIndex'),
          pageSize,
          length: 100
        }
      };

      return pagedData;
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
