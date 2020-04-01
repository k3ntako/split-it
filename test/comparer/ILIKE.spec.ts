import { expect } from 'chai';
import ILIKE from '../../src/comparers/ILIKE';

describe('FileIO', () => {
  describe('writeRow', () => {
    it('should save object in JSON file', () => {
      const rowValue = 'Apple pie';
      const queryValue = 'ApPle PiE';
      const result = ILIKE.compare(rowValue, queryValue);

      expect(result).to.be.true;
    });
  });
});
