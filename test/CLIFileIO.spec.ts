import { expect } from 'chai';
import CLIFileIO from '../src/CLIFileIO';
import fs from 'fs';
import del from 'del';

const ANIMAL_JSON: {}[] = [{ 
  name: 'Koala',
  scientificClassifications: 'Phascolarctos cinereus',
  personality: 'Hella sleepy',
  conservationStatus: 'Vulnerable',
}, {
  name: 'Brown-throated sloth',
  scientificClassifications: 'Bradypus variegatus',
  personality: 'Lazy beyond your wildest imaginations',
  conservationStatus: 'Least Concern',
}];

describe('writeJSON', () => {
  after(async () => {
    await del([process.cwd() + '/test/testData']);
  });

  it('should save object in JSON file', () => {
    

    const fileIO = new CLIFileIO();
    const fileDir = '/test/testData/data.json';
    fileIO.writeJSON(fileDir, ANIMAL_JSON);
   
    const jsonStr = fs.readFileSync(process.cwd() + fileDir, 'utf8');
    const jsonFromFile = JSON.parse(jsonStr); 

    expect(jsonFromFile).to.eql(ANIMAL_JSON);
  });
  
  it('should return object from JSON file', () => {
    const fileIO: CLIFileIO = new CLIFileIO();

    const fileDir: string = '/test/testData/data.json';
    const jsonFromFile: {} | null = fileIO.readJSON(fileDir);

    expect(jsonFromFile).to.eql(ANIMAL_JSON);
  }); 
});
