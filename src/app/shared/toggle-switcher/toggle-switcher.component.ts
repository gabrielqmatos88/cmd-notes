import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'toggle-switcher',
  templateUrl: 'toggle-switcher.component.html',
  styleUrls: ['toggle-switcher.component.css']
})
export class ToggleSwitcherComponent implements OnInit {

  @Input()
  tgId: string;

  @Input()
  tgName: string;
  @Input()
  tgVal: boolean;

  @Output()
  tgValChange = new EventEmitter<boolean>();
  constructor() { }
  ngOnInit() { }
  toggle() {
    console.log('toggle', this.tgVal);
    this.tgValChange.emit(this.tgVal);
  }
}
