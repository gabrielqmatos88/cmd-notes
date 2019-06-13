import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NgForm, Validators, FormControl, ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { ICommand, IParameter } from 'src/app/icommand';
import { ClipboardService } from 'ngx-clipboard';
import { CommandsService } from './../../shared/services/commands.service';
import { downloadFile } from 'src/app/utils';



function validateNotOnlySpaces(c: FormControl) {
  const onlySpaces = /^\s+$/;
  return !onlySpaces.test(c.value) ? null : {
    onlySpaces: {
      valid: false
    }
  };
}

export const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const name = control.get('name');
  const alterEgo = control.get('alterEgo');
  return name && alterEgo && name.value === alterEgo.value ? { 'identityRevealed': true } : null;
};


@Component({
  selector: 'app-commands',
  templateUrl: 'commands.component.html',
  styleUrls: ['commands.component.css']
})

export class CommandsComponent implements OnInit, AfterViewInit {
  @ViewChild('form', { read: NgForm })
  form: NgForm;
  @ViewChild('fileImporter')
  fileImporter: {reset: () => void };
  @ViewChild('btnCloseModal')
  btnCloseModal: any;
  term = '';
  commandList: ICommand[] = [];

  @ViewChild('saveAlert')
  saveAlert: any;
  constructor(private clipBoardService: ClipboardService, private commandService: CommandsService) {}
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
    this.preview = true;
    this.submitted = false;
    this.generatedCommand = '';
    if (!command) {
      this.commandName = '';
      this.commandStr = '';
      this.form.resetForm();
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
          label: (paramName || ''),
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

  private fitTextArea(el) {
    el.style.overflow = 'hidden';
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  }

  autoGrowTextZone(e) {
    this.fitTextArea(e.target);
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
  excluir(cmd?: ICommand) {
    const commandToDelete = cmd || this.selectedCommand;
    if (!!commandToDelete) {
      if (!commandToDelete.isNew) {
        this.commandList = this.commandList.filter( c => c !== commandToDelete);
        localStorage.setItem('cmdlist', JSON.stringify(this.commandList));
      }
      if (!cmd) {
        this.selectedCommand = null;
      }
    }
  }
  ngOnInit() {
    this.commandList = this.commandService.getCommands(true);
  }
  resetImport(): void {
    this.fileImporter.reset();
  }
  private closeModal(): void {
    this.btnCloseModal.nativeElement.click();
  }
  importSuccess(): void {
    this.closeModal();
    this.commandList = this.commandService.getCommands(true);
  }
  exportCommandList(): void {
    const cleanCmdList = this.commandList.map( c => ({ cmdStr: c.cmdStr, name: c.name, tag: c.tag }));
    const dataToExport = {
      type: 'full_list',
      content: cleanCmdList
    };
    downloadFile(JSON.stringify(dataToExport), 'cmd-notes.json');
  }

  exportSingleCmd(): void {
    const cmdToExport: ICommand = {
      name: this.selectedCommand.name,
      cmdStr: this.selectedCommand.cmdStr,
      tag: this.selectedCommand.tag
    };
    const dataToExport = {
      type: 'single',
      content: cmdToExport
    };
    let filename = this.selectedCommand.name;
    filename = filename.toLowerCase().trim().replace(/\s+/ig, '-') + '.json';
    downloadFile(JSON.stringify(dataToExport), filename);
  }
  ngAfterViewInit() {
    // this.form.form.get('cmdName').setValidators([Validators.required, validateNotOnlySpaces]);
  }
}
