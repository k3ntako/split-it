import IPage from '../IPage';
import MenuPage from '../MenuPage';
import { IPrompter } from '../../Prompter';
import { IUserIO } from '../../CLI';
import { userTable, transactionTable } from '../../tables';
import { IUser } from '../../tables/UserTable';
import TransactionUserInput from './TransactionUserInput';

export default class AddTransactionPage implements IPage {
  userIO: IUserIO;
  prompter: IPrompter;
  user: IUser;
  transactionUserInput: TransactionUserInput;

  constructor(userIO: IUserIO, prompter: IPrompter, user: IUser) {
    this.userIO = userIO;
    this.prompter = prompter;
    this.user = user;
    this.transactionUserInput = new TransactionUserInput(userIO, prompter);
  }

  async display(): Promise<IPage> {
    const users: IUser[] = await userTable.getAll();
    const otherUser: IUser | undefined = await this.transactionUserInput.getUser(users, this.user);

    if (!otherUser) {
      throw Error('The other user cannot be undefined.');
    }

    const name: string = await this.transactionUserInput.getName();
    const date: Date = await this.transactionUserInput.getDate();
    const userPaid: boolean = await this.transactionUserInput.getUserPaid();
    const cost: number = await this.transactionUserInput.getCost();

    const [lender, borrower]: IUser[] = userPaid ? [this.user, otherUser] : [otherUser, this.user];

    await transactionTable.create(lender.id, borrower.id, name, date, cost);

    return new MenuPage(this.userIO, this.prompter, this.user);
  }
}
