import App from './App';
import Main from './Main';
import CLI, { IUserIO } from './CLI';
import { IMain } from './Main';
import Prompter, { IPrompter } from './Prompter';
import FileIO from './FileIO';

const cli: IUserIO = new CLI();
const fileIO: FileIO = new FileIO();
const prompter: IPrompter = new Prompter(cli);
const main: IMain = new Main(cli, fileIO, prompter);

const app = new App(main);
app.start();
