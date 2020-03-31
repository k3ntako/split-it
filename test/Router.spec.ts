import { expect } from 'chai';
import Router from '../src/Router';
import MockPage from './mockClasses/mockPage';

describe('Router', () => {
  describe('start', () => {
    it('should take in initial page and display it', async () => {
      const mockPage = new MockPage;
      const router = new Router(mockPage);
      await router.displayPages();

      expect(mockPage.displayCallNum).to.equal(1);
    });

    it('should display pages until currentPage is null', async () => {
      const mockPage = new MockPage;
      const mockNextPage1 = new MockPage;
      const mockNextPage2 = new MockPage;


      mockPage.mockNextPage = mockNextPage1;
      mockNextPage1.mockNextPage = mockNextPage2;

      const router = new Router(mockPage);
      await router.displayPages();

      expect(mockPage.displayCallNum).to.equal(1);
      expect(mockNextPage1.displayCallNum).to.equal(1);
      expect(mockNextPage2.displayCallNum).to.equal(1);
    });
  });
});
