import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'toaster',
  templateUrl: 'toaster.component.html'
})

export class ToasterComponent implements OnInit {
  toasterType: string;
  visible = false;
  message: string;
  constructor() { }

  ngOnInit() { }
  show(message: string, type: string, duration: number = 2000) {
    if (this.visible) {
      return;
    }
    this.message = message;
    this.toasterType = type;
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, duration);
  }
  hide() {
    this.visible = false;
  }
}
