import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getComponentText(): Promise<string> {
    return element(by.className('components')).getText() as Promise<string>;
  }
}
