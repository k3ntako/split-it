import IPage from '../IPage';
import { IUserIO } from '../../CLI';
import { IPrompter } from '../../Prompter';
import { IUser } from '../../tables/UserTable';
import chalk from 'chalk';

export default class ViewBalancePage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
  }

  async display(): Promise<IPage | null> {
    this.userIO.clear();
    this.userIO.print(chalk.bold('Transactions\n'));

    return null;
  }
}
