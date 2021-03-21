import { ExtendzRootPage } from './root.po';

describe('Extendz root', () => {
  let page: ExtendzRootPage;

  beforeEach(() => (page = new ExtendzRootPage()));

  it('should navigate to brands page', () => {
    page.navigateTo();
    page.clickOnBrands();
    expect(page.checkForTitlte()).toEqual('Brands');
  });
});
