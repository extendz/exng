import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, range } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { IdGenerator } from '../indexdb/core/id-generator/id-generator';
import { IndexedDB } from '../indexdb/core/indexed-db.service';
import { API_TOKEN } from './api-interceptor.services';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor(
    @Inject(API_TOKEN) private baseUrl: string,
    private indexedDbService: IndexedDB,
    private idGenerator: IdGenerator
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body, params } = req;
    if (url.startsWith(this.baseUrl)) {
      const spirts = url.split('/');
      const entity = spirts[1];
      const id = spirts[2];
      const ref = spirts[3];

      switch (method) {
        case 'POST':
          // mutipart data
          if (body instanceof FormData) {
            return this.indexedDbService.get(entity, id).pipe(
              map((d) => {
                d[ref] = ['https://images.wallpapersden.com/image/ws-lamborghini_72793.jpg'];
                d['id'] = id;
                return convertToHatos(d, url);
              }),
              mergeMap((d) => this.indexedDbService.update(entity, d)),
              mergeMap((d) => ok(d))
            );
          }

          if (!body['id']) body['id'] = this.idGenerator.generate();
          const hateos = convertToHatos(body, url);
          return this.indexedDbService.create(entity, hateos).pipe(mergeMap((_) => ok(hateos)));
        case 'PATCH':
        case 'PUT':
          body['id'] = id;
          const data = convertToHatos(body, entity);
          return this.indexedDbService.update(entity, data).pipe(mergeMap((d) => ok(d)));
        case 'GET':
          if (id) {
            return this.indexedDbService.get(entity, id).pipe(mergeMap((d) => ok(d)));
          } else {
            const page = +params.get('page');
            const size = +params.get('size');

            return this.indexedDbService.list(entity).pipe(
              // delay(500),
              mergeMap((d) => ok(toHateos(d, entity, page, size)))
            );
          }

        case 'DELETE':
          return this.indexedDbService.delete(entity, id).pipe(mergeMap((d) => ok(d)));
        default:
          return next.handle(req);
      } // switch
    } // if with base url
    return next.handle(req);
  } // intercept
} // class

function toHateos(data: any[], entity: string, page: number, size: number) {
  const out = { _embedded: {}, page: { totalElements: data.length, number: 0, size } };
  out['_embedded'][entity] = data.slice(page * size, page * size + size);
  return out;
}

function convertToHatos(data: any, url: string) {
  data['_links'] = { self: { href: `${url}/${data.id}` } };
  return data;
}

function ok(body: any) {
  return of(new HttpResponse({ status: 200, body }));
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
