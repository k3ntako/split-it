import { expect } from 'chai';
import App from '../src/App';
import MockPage from './mockClasses/mockPage';
import MockRouter from './mockClasses/mockRouter';

describe('App', () => {
  describe('start', () => {
    it('should start router', () => {
      const mockPage = new MockPage;
      const mockRouter: MockRouter = new MockRouter(mockPage);
      const app = new App(mockRouter);
      app.start();

      expect(mockRouter.startCallNum).to.equal(1);
    });
  });
});
