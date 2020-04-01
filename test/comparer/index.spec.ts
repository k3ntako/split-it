import { expect } from 'chai';
import comparers from '../../src/comparers';
import ILIKE from '../../src/comparers/ILIKE';

describe('comparers', () => {
  it('should export all comparers', () => {    
    expect(Object.keys(comparers)).to.have.lengthOf(1);
    expect(comparers.ILIKE).to.eql(ILIKE);
  });
});
