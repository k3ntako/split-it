import { expect } from 'chai';
import WelcomePage from '../../src/pages/WelcomePage';
import LoginPage from '../../src/pages/LoginPage';
import MockCLI from './../mockClasses/mockCLI';

describe('WelcomePage', () => {
  describe('display', () => {
    it('should call print with welcome message', () => {
      const mockCLI: MockCLI = new MockCLI();
      const welcomePage = new WelcomePage(mockCLI);
      welcomePage.display();

      expect(mockCLI.clearCallNum).to.be.at.least(1);
      expect(mockCLI.printArguments[0]).to.equal('Welcome to Split-it!');
    });

    it('should return next page to display', () => {
      const mockCLI: MockCLI = new MockCLI();
      const welcomePage = new WelcomePage(mockCLI);
      const nextPage = welcomePage.display();

      expect(nextPage).to.be.an.instanceOf(LoginPage);
    });
  });
});
