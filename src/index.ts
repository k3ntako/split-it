import App from './App';
import Main from './Main';
import CLI, { IO } from './CLI';
import { IMain } from './Main';
import Prompter, { IPrompter } from './Prompter';

const cli: IO = new CLI();
const prompter: IPrompter = new Prompter(cli);
const main: IMain = new Main(cli, prompter);

const app = new App(main);
app.start();
