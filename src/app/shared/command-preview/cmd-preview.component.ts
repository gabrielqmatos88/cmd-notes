import { CommandPreview } from './cmd-preview';
import { ICommand, IParameter, ParameterType } from './../../icommand';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cmd-preview',
  templateUrl: 'cmd-preview.component.html'
})
export class CmdPreviewComponent implements OnInit, CommandPreview {

  @Input()
  cmd: ICommand;
  generatedCommand: string;
  selectOptions: string[];
  constructor() { }
  ngOnInit() { }

  doPreview() {
    if (this.cmd && this.cmd.parameters) {
      this.cmd.parameters.forEach(p => {
        p.value = p.defaultValue || '';
        if (p.type === ParameterType.list) {
          this.selectOptions = p.listParams ? p.listParams.split(';') : [];
          p.value = this.selectOptions[0] || '';
        }
      });
    }
  }

  copyToClipboard() {

  }

  generateCmd() {
    let cmd = this.cmd.cmdStr || '';
    for (let i = 0; i < this.cmd.parameters.length; i++) {
      const p = this.cmd.parameters[i];
      const combinedExp = new RegExp('#' + p.name + '#', 'gi');
      cmd = cmd.replace(combinedExp, p.value);
    }
    this.generatedCommand = cmd;
    return cmd;
  }

}
