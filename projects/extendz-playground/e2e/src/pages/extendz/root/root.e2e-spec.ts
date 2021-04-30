import { ExtendzRootPage } from './root.po';

const JSON_FILE = '../../../../../src/assets/json/models.json';

describe('Extendz root', () => {
  let page: ExtendzRootPage;

  beforeEach(() => {
    page = new ExtendzRootPage();
    page.navigateToApiPage();
  });

  it('Should display all tiles from json file', () => {
    let modelJson = require(JSON_FILE);
    const urls = Object.keys(modelJson)
      .map((key) => {
        const model = modelJson[key];
        return model.url;
      })
      .sort();

    expect(page.getAllUrl().getText()).toEqual(urls);
  });

  it('Should navigate to brands "data table" page', () => {
    page.clickOnBrandsTitle();
    expect(page.isInBrandPage()).toContain('brand');
  });
});
