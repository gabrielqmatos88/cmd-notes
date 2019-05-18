import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ICommand, IParameter } from './icommand';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('form', { read: NgForm })
  form: NgForm;
  commandList: ICommand[] = [
    {
      name: 'XMO get',
      cmdStr: 'xmo-client -p "${xpath}"',
      tag: 'xmo'
    },
    {
      name: 'XMO set',
      cmdStr: 'xmo-client -p "${xpath}" -s "${value}"',
      tag: 'xmo'
    },
    {
      name: 'XMO Senha (uid)',
      cmdStr: 'xmo-client -p "Device/UserAccounts/Users/User[@uid=${Uid}]" -s "${Senha}"',
      tag: 'xmo'
    },
    {
      name: 'XMO Senha (login)',
      cmdStr: 'xmo-client -p "Device/UserAccounts/Users/User[Login=\'${Login}\']" -s "${Senha}"',
      tag: 'xmo'
    }
  ];

  constructor() {}
  generatedCommand =  '';
  commandName = '';
  commandStr = '';
  selectedCommand: ICommand;
  submitted = false;
  preview = false;
  setCmd(command?: ICommand) {
    if (command === this.selectedCommand) {
      return;
    }
    this.form.resetForm();
    this.preview = false;
    this.submitted = false;
    this.generatedCommand = '';
    if (!command) {
      this.commandName = '';
      this.commandStr = '';
      this.selectedCommand = {
        name: this.commandName,
        cmdStr: this.commandStr,
        isNew: true
      };
    } else {
      this.commandName = command.name;
      this.commandStr = command.cmdStr;
      this.selectedCommand = command;
    }
    this.selectedCommand.parameters = this.selectedCommand.parameters || [];
  }
  private parseParameters(command: ICommand): IParameter[] {
    const parameters =  (command.cmdStr).match(/\$\{\s*([a-z0-9\-_]+)\s*\}/ig) || [];
    const parsedParameters: IParameter[] = [];
    for (let i = 0; i < parameters.length; i++) {
      const par = parameters[i];
      const paramName = par.replace(/[\$\{\}]/g, '').trim();
      if (!parsedParameters.find( p => p.name === paramName)) {
        parsedParameters.push({
          name: paramName,
          value: ''
        });
      }
    }
    return parsedParameters;
  }

  updateName(e) {
    this.selectedCommand.name = e.target.value;
  }

  updateCommandStr(e) {
    this.selectedCommand.cmdStr = e.target.value;
  }

  doPreview() {
    this.preview = true;
    if (!!this.selectedCommand) {
      this.selectedCommand.parameters = this.parseParameters(this.selectedCommand);
    }
  }

  generateCmd(){
    let cmd = this.selectedCommand.cmdStr || '';
    for (let i = 0; i < this.selectedCommand.parameters.length; i++) {
      const p = this.selectedCommand.parameters[i];
      const combinedExp = new RegExp('\\$\\{\\s*' + p.name + '\\s*\\}', 'gi');
      cmd = cmd.replace(combinedExp, p.value);
    }
    this.generatedCommand = cmd;
  }

  save() {
    this.submitted = true;
    if (this.form.valid) {
      if (this.selectedCommand.isNew) {
        this.commandList.push(this.selectedCommand);
        this.selectedCommand.isNew = null;
      }
      localStorage.setItem('cmdlist', JSON.stringify(this.commandList));
      this.submitted = false;
    }
  }
  ngAfterViewInit() {
  }
  ngOnInit(){
    const loaded = localStorage.getItem('cmdlist');
    if (!!loaded) {
      this.commandList = JSON.parse(loaded);
    }
  }
}
