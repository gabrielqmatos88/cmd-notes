import { ICommand } from 'src/app/icommand';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CommandsService {
  private commandList:  ICommand[];
  constructor() {
    this.load();
  }
  private load(): ICommand[] {
    const loaded = localStorage.getItem('cmdlist');
    this.commandList = [];
    if (!!loaded) {
      this.commandList = JSON.parse(loaded);
    }
    return this.commandList;
  }
  getCommands(reload?: boolean): ICommand[] {
    if (!!reload) {
      this.load();
    }
    return this.commandList;
  }
  addCommands(commands: ICommand[], replaces?: boolean): Observable<ICommand[]> {
    if (replaces) {
      this.commandList = commands;
    } else {
      this.commandList = this.commandList.concat(commands);
    }
    return this.save();
  }
  save(): Observable<ICommand[]> {
    const result = new Observable<ICommand[]>( obj => {
      try {
        if (!!this.commandList) {
          localStorage.setItem('cmdlist', JSON.stringify(this.commandList));
        }
        obj.next(this.commandList);
        obj.complete();
      } catch (error) {
        obj.error('cannot be save');
        obj.complete();
      }
    });
    return result;
  }
  delete(cmd: ICommand): Observable<ICommand[]> {
    const commandToDelete = cmd;
    if (!!commandToDelete) {
      if (!commandToDelete.isNew) {
        this.commandList = this.commandList.filter( c => c !== commandToDelete);
      }
    }
    return this.save();
  }
}
