import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ICommand, IParameter } from 'src/app/icommand';
import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-commands',
  templateUrl: 'commands.component.html',
  styleUrls: ['commands.component.css']
})

export class CommandsComponent implements OnInit {
  @ViewChild('form', { read: NgForm })
  form: NgForm;
  term = '';
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

  @ViewChild('saveAlert')
  saveAlert: any;
  constructor(private clipBoardService: ClipboardService) {}
  generatedCommand =  '';
  commandName = '';
  commandStr = '';
  selectedCommand: ICommand;
  submitted = false;
  preview = false;
  action: string = '';
  setCmd(command?: ICommand) {
    if (!!command && command === this.selectedCommand) {
      return;
    }
    this.form.resetForm();
    this.preview = true;
    this.submitted = false;
    this.generatedCommand = '';
    if (!command) {
      this.commandName = '';
      this.commandStr = '';
      this.preview = false;
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
    if (!this.selectedCommand.isNew && !this.selectedCommand.parameters.length) {
      this.generateCmd();
    }
  }

  startEdit() {
    this.preview = false;
    this.commandName = this.selectedCommand.name;
    this.commandStr = this.selectedCommand.cmdStr;
  }
  private splitCamelCaseWithAbbreviations(s){
    return s.split(/([A-Z][a-z]+)/).filter(function(e){return e}).join(' ');
  }
  private parseParameters(command: ICommand): IParameter[] {
    const parameters =  (command.cmdStr).match(/\$\{\s*([a-z0-9\-_]+)(:[a-z\.\-\_0-9\,\s\@]+)?\s*\}/ig) || [];
    const parsedParameters: IParameter[] = [];
    for (let i = 0; i < parameters.length; i++) {
      const par = parameters[i];
      let defaultValue;
      if (/:[a-z\.\-\_0-9\,\s\@]+/.test(par)) {
        defaultValue = /:[a-z\.\-\_0-9\,\s\@]+/.exec(par)[0].replace(':', '').trim();
      }
      const paramName = par.replace(/[\$\{\}]/g, '').replace(/:[a-z\.\-\_0-9\,\s\@]+/, '').trim();
      if (!parsedParameters.find( p => p.name === paramName)) {
        parsedParameters.push({
          name: paramName,
          label: this.splitCamelCaseWithAbbreviations(paramName || ''),
          value: defaultValue || '',
          defaultValue: defaultValue
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
    this.autoGrowTextZone(e);
  }

  copyToClipboard() {
    if (this.clipBoardService.copyFromContent(this.generatedCommand)) {
      this.saveAlert.show('Copiado com sucesso', 'alert-success');
    } else {
      this.saveAlert.show('Falha ao copiar', 'alert-danger');
    }
  }

  doPreview() {
    this.preview = true;
    if (!!this.selectedCommand) {
      this.selectedCommand.parameters = this.parseParameters(this.selectedCommand);
    }
    // this.generatedCommand = '';
  }

  generateCmd(){
    let cmd = this.selectedCommand.cmdStr || '';
    for (let i = 0; i < this.selectedCommand.parameters.length; i++) {
      const p = this.selectedCommand.parameters[i];
      const combinedExp = new RegExp('\\$\\{\\s*' + p.name + '(:[a-z\\.\\-\\_0-9\\,\\s\\@]+)?\\s*\\}', 'gi');
      cmd = cmd.replace(combinedExp, p.value);
    }
    this.generatedCommand = cmd;
    return cmd;
  }

  autoGrowTextZone(e) {
    e.target.style.overflow = 'hidden';
    e.target.style.height = '0px';
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  save() {
    this.submitted = true;
    if (this.form.valid) {
      if (this.selectedCommand.isNew) {
        this.commandList.push(this.selectedCommand);
        this.selectedCommand.isNew = null;
      }
      // this.selectedCommand.cmdStr = this.formatForSave(this.selectedCommand.cmdStr);
      localStorage.setItem('cmdlist', JSON.stringify(this.commandList));
      this.submitted = false;
      this.saveAlert.show('Salvo com sucesso', 'alert-success');
      this.doPreview();
      if (!this.selectedCommand.parameters || !this.selectedCommand.parameters.length) {
        this.generateCmd();
      }
    } else {
      this.saveAlert.show('Preencha os dados', 'alert-danger');
    }
  }
  excluir() {
    if (!!this.selectedCommand) {
      if (!this.selectedCommand.isNew) {
        this.commandList = this.commandList.filter( c => c !== this.selectedCommand);
        localStorage.setItem('cmdlist', JSON.stringify(this.commandList));
      }
      this.selectedCommand = null;
    }
  }
  ngOnInit() {
    const loaded = localStorage.getItem('cmdlist');
    if (!!loaded) {
      this.commandList = JSON.parse(loaded);
    }
  }
}
