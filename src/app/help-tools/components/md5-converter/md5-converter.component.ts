import { Component, OnInit } from '@angular/core';
import md5 from 'md5-hash';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'md5-converter',
  templateUrl: 'md5-converter.component.html'
})

export class MD5cONVERTERComponent implements OnInit {
  value: string;
  result: string;
  copied: boolean;
  constructor(private clipBoardService: ClipboardService) { }

  ngOnInit() { }
  convert() {
    this.result = md5(this.value || '');
  }

  copyToClipboard() {
    if (this.clipBoardService.copyFromContent(this.result)) {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }
}
