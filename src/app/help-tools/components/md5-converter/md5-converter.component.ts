import { Component, OnInit } from '@angular/core';
import md5 from 'md5-hash';

@Component({
  selector: 'md5-converter',
  templateUrl: 'md5-converter.component.html'
})

export class MD5cONVERTERComponent implements OnInit {
  value: string;
  result: string;
  constructor() { }

  ngOnInit() { }
  convert() {
    this.result = md5(this.value || '');
  }
}
