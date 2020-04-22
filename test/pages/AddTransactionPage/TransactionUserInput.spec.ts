import { expect } from 'chai';
import TransactionUserInput from '../../../src/pages/AddTransactionPage/TransactionUserInput';
import MockCLI from '../../mockClasses/mockCLI';
import Prompter from '../../../src/Prompter';
import { IUser } from '../../../src/tables/UserTable';

describe('TransactionUserInput', () => {
  describe('getUser', () => {
    it('should ask user who the transaction was with', async () => {
      const activeUser = { id: 1, first_name: 'Charlie' };
      const users: IUser[] = [
        {
          id: 1,
          first_name: 'Charlie',
        },
        {
          id: 2,
          first_name: 'Puff',
        },
        {
          id: 3,
          first_name: 'Piper',
        },
      ];

      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ action: 'Puff' }];
      const prompter: Prompter = new Prompter(mockCLI);

      const transactionUserInput = new TransactionUserInput(mockCLI, prompter);
      const otherUser: IUser | undefined = await transactionUserInput.getUser(users, activeUser);
      expect(mockCLI.clearCallNum).to.equal(1);

      expect(otherUser).to.eql({
        id: 2,
        first_name: 'Puff',
      });

      expect(mockCLI.promptArguments[0].message).to.equal('Who was this transaction with?');
      expect(mockCLI.promptArguments[0].type).to.equal('list');
      expect(mockCLI.promptArguments[0].choices).to.eql(['Puff', 'Piper']);
    });
  });

  describe('getName', () => {
    it('should ask to name the transaction', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ input: 'Lunch' }];
      const prompter: Prompter = new Prompter(mockCLI);

      const transactionUserInput = new TransactionUserInput(mockCLI, prompter);
      const name: string = await transactionUserInput.getName();

      expect(mockCLI.clearCallNum).to.equal(1);

      expect(name).to.equal('Lunch');

      expect(mockCLI.promptArguments[0].message).to.equal('Name the transaction:');
      expect(mockCLI.promptArguments[0].type).to.equal('input');
    });

    it('should continue to ask until it gets a valid input', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ input: '' }, { input: '  ' }, { input: 'Dinner' }];
      const prompter: Prompter = new Prompter(mockCLI);

      const transactionUserInput = new TransactionUserInput(mockCLI, prompter);
      const name: string = await transactionUserInput.getName();

      expect(mockCLI.clearCallNum).to.equal(3);
      expect(name).to.equal('Dinner');
    });
  });

  describe('getDate', () => {
    it('should ask user for transaction date', async () => {
      const dateInput = new Date();
      dateInput.setHours(0, 0, 0, 0);

      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ date: dateInput }];
      const prompter: Prompter = new Prompter(mockCLI);

      const transactionUserInput = new TransactionUserInput(mockCLI, prompter);
      const date: Date = await transactionUserInput.getDate();
      expect(mockCLI.clearCallNum).to.equal(1);

      expect(date).to.eql(date);

      expect(mockCLI.promptArguments[0].message).to.equal('When was the transaction?');
      expect(mockCLI.promptArguments[0].type).to.equal('datetime');
    });
  });

  describe('getUserPaid', () => {
    it('should ask user if they paid for the transaction', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ confirmation: true }];
      const prompter: Prompter = new Prompter(mockCLI);

      const transactionUserInput = new TransactionUserInput(mockCLI, prompter);
      const userPaid: boolean = await transactionUserInput.getUserPaid();
      expect(mockCLI.clearCallNum).to.equal(1);

      expect(userPaid).to.eql(true);

      expect(mockCLI.promptArguments[0].message).to.equal('Did you pay for this?');
      expect(mockCLI.promptArguments[0].type).to.equal('confirm');
    });
  });

  describe('getCost', () => {
    it('should ask user for transaction cost', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ number: 100 }];
      const prompter: Prompter = new Prompter(mockCLI);

      const transactionUserInput = new TransactionUserInput(mockCLI, prompter);
      const cost: number = await transactionUserInput.getCost();
      expect(mockCLI.clearCallNum).to.equal(1);

      expect(cost).to.eql(100);

      expect(mockCLI.promptArguments[0].message).to.equal('How much did it cost?');
      expect(mockCLI.promptArguments[0].type).to.equal('number');
    });

    it('should continue to ask until it gets a valid input', async () => {
      const mockCLI: MockCLI = new MockCLI();
      mockCLI.promptMockAnswers = [{ number: 0 }, { number: -100 }, { number: 10.124 }, { number: 10.12 }];
      const prompter: Prompter = new Prompter(mockCLI);

      const transactionUserInput = new TransactionUserInput(mockCLI, prompter);
      const cost: number = await transactionUserInput.getCost();
      expect(mockCLI.clearCallNum).to.equal(4);

      expect(cost).to.eql(10.12);

      expect(mockCLI.promptArguments[0].message).to.equal('How much did it cost?');
      expect(mockCLI.promptArguments[0].type).to.equal('number');
    });
  });
});
