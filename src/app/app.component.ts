import { Component, ViewChild, AfterViewInit, OnInit, Renderer2, Inject } from '@angular/core';
import { ICommand, IParameter } from './icommand';
import { NgForm } from '@angular/forms';
import { DOCUMENT } from '@angular/platform-browser';

declare var $: any;
export interface ITheme {
  id: number;
  name: string;
  icon: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('form', { read: NgForm })
  form: NgForm;
  commandList: ICommand[] = [];
  themeList: ITheme[] = [
    {
      id: 1,
      name: 'light',
      icon: 'sun'
    },
    {
      id: 2,
      name: 'dark',
      icon: 'moon'
    }
  ];

  themeList1: ITheme[];
  themeList2: ITheme[];

  @ViewChild('saveAlert')
  saveAlert: any;
  generatedCommand =  '';
  commandName = '';
  commandStr = '';
  selectedCommand: ICommand;
  submitted = false;
  preview = false;


  currentTheme = localStorage.getItem('theme');
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document) {
    this.themeList1 = this.themeList.filter(th => th.id <= 2);
    this.themeList2 = this.themeList.filter(th => th.id > 2);
  }

  changeTheme(theme) {
    const baseHref = $('base').attr('href');
    this.renderer.removeClass(document.body, 'theme-' + this.currentTheme);
    this.currentTheme = theme;
    this.renderer.addClass(document.body, 'theme-' + this.currentTheme);
    $('#theme').attr('href', baseHref + 'assets/css/bootstrap.' + theme + '.css');
    localStorage.setItem('theme', this.currentTheme);
  }
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

  doPreview() {
    this.preview = true;
    if (!!this.selectedCommand) {
      this.selectedCommand.parameters = this.parseParameters(this.selectedCommand);
    }
    this.generatedCommand = '';
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
  ngAfterViewInit() {}
  ngOnInit() {
    const loaded = localStorage.getItem('cmdlist');
    if (!!loaded) {
      this.commandList = JSON.parse(loaded);
    }
  }
}
