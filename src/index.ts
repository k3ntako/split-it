import App from './App';
import WelcomePage from './pages/WelcomePage';
import CLI, { IUserIO } from './CLI';
import IPage from './pages/IPage';
import Router, { IRouter } from './Router';

const cli: IUserIO = new CLI();
const welcomePage: IPage = new WelcomePage(cli);
const router: IRouter = new Router(welcomePage);

(async () => {
  const app = new App(router);
  await app.start();
})();
