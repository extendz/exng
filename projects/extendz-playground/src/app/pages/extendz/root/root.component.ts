import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMeta } from 'extendz/core';
import * as faker from 'faker';
import { forkJoin } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  public onSelect(model: EntityMeta) {
    this.router.navigate([model.name], { relativeTo: this.activeRoute });
  } // onSelect()

  public generateCustomers() {
    // customers
    for (let index = 0; index < 100; index++) {
      const customer = {
        profilePicture: `https://randomuser.me/api/portraits/women/${Math.floor(
          Math.random() * 70 + 1
        )}.jpg`,
        firstName: faker.name.findName(),
        lastName: faker.name.lastName(),
      };
      this.http.post('customers', customer).pipe(take(1)).subscribe();
    }
  }

  public generateProducts() {
    // customers
    for (let index = 0; index < 100; index++) {
      const customer = {
        image: `https://picsum.photos/id/${Math.floor(Math.random() * 100 + 1)}/50`,
        name: faker.commerce.productName(),
        code: faker.commerce.product(),
      };
      this.http.post('products', customer).pipe(take(1)).subscribe();
    }
  }

  public generateOwners() {
    for (let index = 0; index < 100; index++) {
      const customer = {
        name: faker.name.findName(),
        email: faker.internet.email(),
      };
      this.http.post('owners', customer).pipe(take(1)).subscribe();
    }
  }

  fakeData() {
    this.generateBrands();
    this.generateCurrencies();
  }

  generateCurrencies() {
    this.http
      .get('assets/json/currency.json')
      .pipe(
        mergeMap((d) => {
          const all = [];
          Object.keys(d).forEach((k) => {
            const c = d[k];
            const curr = { code: c.code, name: c.name };
            all.push(this.http.post('currencies', curr).pipe(take(1)));
          });
          return forkJoin(all);
        })
      )
      .subscribe((d) => {});
  }

  generateBrands() {
    this.http
      .get('assets/json/car_brands.json')
      .pipe(
        take(1),
        mergeMap((d: any[]) => {
          const xx = d.map((x) => this.http.post('brands', x).pipe(take(1)));
          return forkJoin(xx);
        })
      )

      .subscribe();
  }
} //class
