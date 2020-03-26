import { expect } from 'chai';
import FileIO from '../src/FileIO';
import fs from 'fs';
import del from 'del';

const KOALA: {} = { 
  name: 'Koala',
  scientificClassifications: 'Phascolarctos cinereus',
  personality: 'Hella sleepy',
  conservationStatus: 'Vulnerable',
};

let animalsRowId: string;

describe('FileIO', () => {
  after(async () => {
    await del([process.cwd() + '/data']);
  });

  describe('writeRow', () => {
    it('should save object in JSON file', () => {
      const fileIO = new FileIO();
      const koala = fileIO.writeRow('animals', KOALA);
    
      // Get object from database
      const databaseFileDir = '/data/animals.json';
      const jsonStr = fs.readFileSync(process.cwd() + databaseFileDir, 'utf8');
      const jsonFromFile = JSON.parse(jsonStr); 

      const keys = Object.keys(KOALA).concat('id');      
      expect(jsonFromFile[0]).to.have.all.keys(keys);

      //used in next test
      animalsRowId = koala.id;
    });
  });
  
  describe('readRow', () => {
    it('should return object from JSON file', () => {
      const fileIO: FileIO = new FileIO();

      const jsonFromFile: {} | null = fileIO.readRow('animals', animalsRowId);

      if (jsonFromFile) {
        const keys = Object.keys(KOALA).concat('id');
        expect(jsonFromFile).to.have.all.keys(keys);
      } else {
        expect(jsonFromFile).to.exist;
      }
    }); 
  });
});
