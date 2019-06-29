import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

export interface DotDropdownItem {
  label: string;
  icon?: string;
  action?: () => any;
}

@Component({
  selector: 'dot-dropdown',
  templateUrl: 'dot-dropdown.component.html'
})
export class DotDropdownComponent implements OnInit {
  @Input()
  items: DotDropdownItem[];

  @Output()
  selectionChange = new EventEmitter<DotDropdownItem>();
  open: boolean;
  constructor() { }
  ngOnInit() { }
  toggle() {
    this.open = !this.open;
  }
  select(item: DotDropdownItem) {
    this.selectionChange.emit(item);
    if (!!item.action) {
      item.action();
    }
  }
}
