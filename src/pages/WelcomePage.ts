import { IUserIO } from '../CLI';
import Prompter from '../Prompter';
import FileIO from '../FileIO';
import IPage from './IPage';
import LoginPage from './LoginPage';

export default class WelcomePage implements IPage {
  userIO: IUserIO;

  constructor(userIO: IUserIO) {
    this.userIO = userIO;
  }

  display(): IPage {
    this.userIO.clear();
    this.userIO.print('Welcome to Split-it!');

    return new LoginPage(this.userIO, new FileIO, new Prompter(this.userIO));
  }
}
