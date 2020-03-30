import { expect } from 'chai';
import FileIO from '../src/FileIO';
import fs from 'fs';
import del from 'del';

after(async () => {
  await del([process.cwd() + '/test/data']);
});

interface IAnimal {
  [key: string]: string | number;
  name: string;
  scientificClassifications: string;
  personality: string;
  conservationStatus: string;
  lifespan: number;
}

const KOALA: IAnimal = { 
  name: 'Koala',
  scientificClassifications: 'Phascolarctos cinereus',
  personality: 'Hella sleepy',
  conservationStatus: 'Vulnerable',
  lifespan: 15,
};

const SLOTH: IAnimal = {
  name: 'Brown-throated sloth',
  scientificClassifications: 'Bradypus variegatus',
  personality: 'Lazy beyond your wildest imaginations',
  conservationStatus: 'Least Concern',
  lifespan: 35,
};

let animalsRowId: string;

const databaseFolderDir: string = '/test/data';

describe('FileIO', () => {
  describe('writeRow', () => {
    it('should save object in JSON file', () => {
      const fileIO = new FileIO();
      const koalaReturned = fileIO.writeRow('animals', KOALA);
    
      // Get object from database
      const databaseFileDir = databaseFolderDir + '/animals.json';
      const jsonStr = fs.readFileSync(process.cwd() + databaseFileDir, 'utf8');
      const jsonFromFile = JSON.parse(jsonStr); 

      expect(jsonFromFile).to.be.an('object');
      expect(Object.keys(jsonFromFile)).to.have.lengthOf(1);

      const koalaInFile = jsonFromFile[koalaReturned.id];

      const animalKeys = Object.keys(KOALA);   
      expect(koalaInFile).to.have.all.keys(animalKeys.concat('id'));

      animalKeys.forEach(key => {
        expect(koalaInFile[key], `should have expected ${key} in JSON file`).to.equal(KOALA[key]);
        expect(koalaReturned[key], `should have expected ${key} in returned object`).to.equal(KOALA[key]);
      });

      // used in readRow test
      animalsRowId = koalaReturned.id;
    });

    it('should save a second object', () => {
      const fileIO = new FileIO();
      const slothReturned = fileIO.writeRow('animals', SLOTH);

      // Get object from database
      const databaseFileDir = databaseFolderDir + '/animals.json';
      const jsonStr = fs.readFileSync(process.cwd() + databaseFileDir, 'utf8');
      const jsonFromFile = JSON.parse(jsonStr);
      const slothFromFile = jsonFromFile[slothReturned.id];

      expect(Object.keys(jsonFromFile)).to.have.lengthOf(2);

      const animalKeys = Object.keys(SLOTH);
      expect(slothFromFile).to.have.all.keys(animalKeys.concat('id'));

      animalKeys.forEach(key => {
        expect(slothFromFile[key], `should have expected ${key} in JSON file`).to.equal(SLOTH[key]);
        expect(slothReturned[key], `should have expected ${key} in returned object`).to.equal(SLOTH[key]);
      });
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
