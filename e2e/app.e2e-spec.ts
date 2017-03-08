import { SignpostA2Page } from './app.po';

describe('signpost-a2 App', () => {
  let page: SignpostA2Page;

  beforeEach(() => {
    page = new SignpostA2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
