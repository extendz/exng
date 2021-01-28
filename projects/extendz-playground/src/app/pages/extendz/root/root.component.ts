import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMeta } from 'extendz/core';
import * as faker from 'faker';
import { take } from 'rxjs/operators';

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
} //class
