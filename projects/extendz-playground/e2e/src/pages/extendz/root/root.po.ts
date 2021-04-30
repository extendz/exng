import { browser, by, element } from 'protractor';
import { BASE_PATH } from '../consts';

export class ExtendzRootPage {
  getAllUrl() {
    return element.all(by.css('.url'));
  }

  navigateToApiPage(): Promise<unknown> {
    return browser.get(BASE_PATH) as Promise<unknown>;
  }

  clickOnBrandsTitle() {
    browser.waitForAngularEnabled(false);
    return element(by.cssContainingText('span.name', 'Brands')).click();
  }

  isInBrandPage() {
    return browser.getCurrentUrl();
  }

  checkForTitlte() {
    return element(by.cssContainingText('span.title', 'Brands')).getText() as Promise<string>;
  }
}
