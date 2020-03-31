import { expect } from 'chai';
import Router from '../src/Router';
import MockPage from './mockClasses/mockPage';

describe('Router', () => {
  describe('start', () => {
    it('should take in initial page and display it', async () => {
      const mockPage = new MockPage;
      const router = new Router(mockPage);
      router.start();

      expect(mockPage.startCallNum).to.equal(1);
    });
  });

  describe('navigateTo', () => {
    it('should display page passed in', async () => {
      const initialPage = new MockPage;
      const navigateToPage = new MockPage;

      const router = new Router(initialPage);
      router.start();
      router.navigateTo(navigateToPage);

      expect(navigateToPage.startCallNum).to.equal(1);
    });
  });
});
