import { browser, by, element, ElementFinder } from 'protractor';
import { BASE_PATH } from '../consts';

export class ExtendzDataTablePage {
  base = `${BASE_PATH}/brand`;

  navigateToBrandDatatablePage() {
    return browser.get(this.base) as Promise<any>;
  }

  clickOnAddNewButton() {
    browser.waitForAngularEnabled(false);
    return element(by.css('.add')).click();
  }

  getCurrentUrl() {
    return browser.getCurrentUrl();
  }

  back() {
    browser.navigate().back();
  }

  getRowAt(index: number) {
    return element.all(by.tagName('mat-row')).get(index);
  }

  getColumnByName(elemetFinder: ElementFinder, name: string) {
    elemetFinder.all(by.tagName('mat-cell'));
  }
}
