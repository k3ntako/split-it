import App from './App';
import WelcomePage from './pages/WelcomePage';
import CLI, { IUserIO } from './CLI';
import Prompter, { IPrompter } from './Prompter';
import FileIO from './FileIO';
import IPage from './pages/IPage';

const cli: IUserIO = new CLI();
const fileIO: FileIO = new FileIO();
const prompter: IPrompter = new Prompter(cli);
const welcomePage: IPage = new WelcomePage(cli, fileIO, prompter);

const app = new App(welcomePage);
app.start();
