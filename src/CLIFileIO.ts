import fs from 'fs';
import path from 'path';

export interface ICLIFileIO {
  writeJSON(dir: string, json: [] | {}): void;
  readJSON(dir: string): {} | null;
}

export default class CLIFileIO implements ICLIFileIO{
  private baseDir: string;

  constructor(){
    this.baseDir = process.cwd();
  }

  writeJSON(dir: string, json: [] | {}): void{
    const fileDir: string = this.baseDir + dir;
    const folderDir: string = path.dirname(fileDir);
    
    this.softCreateDir(folderDir);

    const jsonStr = JSON.stringify(json);

    fs.writeFileSync(fileDir, jsonStr, { encoding: 'utf-8', flag: 'w' });
  }

  readJSON(dir: string): {} | null {
    const fileDir: string = this.baseDir + dir;
    const fileExists: boolean = fs.existsSync(fileDir);

    if (!fileExists) {
      return null;
    }

    const jsonStr: string = fs.readFileSync(fileDir, 'utf-8');

    return JSON.parse(jsonStr);
  }

  private softCreateDir(folderDir: string): void{
    const folderExists: boolean = fs.existsSync(folderDir);
    !folderExists && fs.mkdirSync(folderDir);
  }
}