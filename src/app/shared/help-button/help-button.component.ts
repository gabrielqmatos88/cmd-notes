import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'help-button',
  templateUrl: 'help-button.component.html'
})

export class HelpButtonComponent implements OnInit {
  @Input()
  target: string;
  clicked = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  exec() {
    this.clicked.emit();
  }
}
