import { expect } from 'chai';
import comparers from '../../src/comparers';
import ILIKE from '../../src/comparers/ILIKE';

describe('comparers', () => {
  it('should export all comparers', () => {    
    expect(comparers).to.have.lengthOf(1);
    expect(comparers[0]).to.eql(ILIKE);
  });
});
