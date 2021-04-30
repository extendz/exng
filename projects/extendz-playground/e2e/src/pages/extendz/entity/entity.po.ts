import { browser, by, element } from 'protractor';
import { BASE_PATH } from '../consts';

export class ExtendzEntityPage {
  base = `${BASE_PATH}/product/new`;

  navigateToProductEntityPage() {
    return browser.get(this.base) as Promise<any>;
  }

  clickOnNameFieldAndFillText() {
    let el = element(by.id('name'));
    el.click();
    el.sendKeys('Extendz');
  }

  clickSave() {
    element(by.id('btnSave')).click();
  }

  showSuccessToast() {
    return browser.driver.findElement(by.tagName('simple-snack-bar')).getText() as Promise<string>;
  }

  getCurrentUrl() {
    browser.sleep(1000);
    return browser.getCurrentUrl();
  }

  createNewProduct() {
    this.navigateToProductEntityPage();
    this.clickOnNameFieldAndFillText();
    this.clickSave();
  }
}
