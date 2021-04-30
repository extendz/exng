import { ExtendzEntityPage } from './entity.po';

describe('Extendz Entity', () => {
  let page: ExtendzEntityPage;

  beforeEach(() => {
    page = new ExtendzEntityPage();
  });

  it('Sholud save the entity and show toast with message', () => {
    page.navigateToProductEntityPage();
    page.clickOnNameFieldAndFillText();
    page.clickSave();
    expect(page.showSuccessToast()).toEqual('Created');
  });

  it('Sholud save the entity and redirected to new url', () => {
    page.navigateToProductEntityPage();
    page.clickOnNameFieldAndFillText();
    page.clickSave();
    expect(page.getCurrentUrl()).not.toContain('/new');
  });
});
