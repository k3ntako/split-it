import App from './App';
import Main from './Main';
import CLI from './CLI';
import ICLI from './ICLI';
import IMain from './IMain';

const cli: ICLI = new CLI();
const main: IMain = new Main(cli);

const app = new App(main);
app.start();
