/***
 * @author Randika Hapugoda
 */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export const API_TOKEN = 'API';

@Injectable()
export class ApiInterceptorService implements HttpInterceptor {
  constructor(@Inject(API_TOKEN) private baseUrl: string) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('assets')) {
      return next.handle(req);
    }

    // Skip if base URL is there
    if (req.url.startsWith(this.baseUrl)) {
      return next.handle(req);
    }

    const apiReq = req.clone({
      url: `${this.baseUrl}${req.url}`,
    });

    return next.handle(apiReq);
  } // intercept()
} // class
