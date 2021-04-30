import { ExtendzEntityPage } from '../entity/entity.po';
import { ExtendzDataTablePage } from './dataTable.po';

describe('Extendz Data Table', () => {
  let page: ExtendzDataTablePage;
  let entityPage: ExtendzEntityPage;

  beforeAll(() => (entityPage = new ExtendzEntityPage()));

  beforeEach(() => (page = new ExtendzDataTablePage()));

  it('Should able to navigate to new entity page', () => {
    page.navigateToBrandDatatablePage();
    page.clickOnAddNewButton();
    expect(page.getCurrentUrl()).toContain('new');
  });

  it('Should show the created Product', () => {
    entityPage.createNewProduct();
    page.back();
    // page.getFirstRow();
  });
});
