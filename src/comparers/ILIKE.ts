import { IComparer } from ".";

const ILIKE: IComparer = {
  compare(rowValue: string, queryValue: string): boolean {
    return rowValue.toLowerCase() === queryValue.toLowerCase();
  },
  validate(rowValue: string, queryValue: string) {
    const isValid = typeof rowValue === 'string' && typeof queryValue === 'string';
    
    if (!isValid) {
      throw new Error('ILIKE can only be used to compare strings.');
    }

    return true;
  }
}

export default ILIKE;