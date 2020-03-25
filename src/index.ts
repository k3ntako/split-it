import App from './App';
import Main from './Main';
import CLI from './CLI';
import ICLI from './ICLI';
import IMain from './IMain';
import IPrompter from './IPrompter';
import Prompter from './Prompter';

const cli: ICLI = new CLI();
const prompter: IPrompter = new Prompter(cli);
const main: IMain = new Main(cli, prompter);

const app = new App(main);
app.start();
