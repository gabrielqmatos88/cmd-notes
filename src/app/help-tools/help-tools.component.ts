import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'help-tools',
  templateUrl: 'help-tools.component.html'
})
export class HelpToolsComponent implements OnInit {
  selectedTool = '';
  availableTools = ['md5'];
  constructor() { }

  ngOnInit() { }
}
