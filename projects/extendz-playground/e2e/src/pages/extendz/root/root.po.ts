import { browser, by, element, ExpectedConditions } from 'protractor';

export class ExtendzRootPage {
  base = `${browser.baseUrl}api`;

  navigateTo(): Promise<unknown> {
    return browser.get(this.base) as Promise<unknown>;
  }

  clickOnBrands() {
    return element(by.cssContainingText('span.name', 'Brands')).click();
  }

  //   isInBrandPage() {
  //     return browser.driver.wait(() => {
  //       let base = this.base;
  //       browser.driver.getCurrentUrl().then(function (url) {
  //         return expect(url).toEqual(`${base}/brand`);
  //       });
  //     }, 1000);
  //   }

  checkForTitlte() {
    return element(by.cssContainingText('span.title', 'Brands')).getText() as Promise<string>;
  }
}
