import { Component, NgZone, ViewChild } from '@angular/core';
import { HarService, IHarResult } from './har.service';
import { Title } from '@angular/platform-browser';
import { isObject } from 'util';
import { downloadFile } from './utils';
declare var html2canvas: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  exportName: string;
  selectedFileName: string;
  parsedRequests: IHarResult[];
  parseError = false;
  foundErrors: any[];
  @ViewChild('fileSelector')
  fileSelector: any;
  private file: any;

  constructor(private harService: HarService, private zone: NgZone, private titleService: Title) {}
  fileChanged(e) {
    if (!!e && e.target && e.target.files && e.target.files[0]) {
      this.file = e.target.files[0];
      this.readDocument();
    }
  }
  mergeFoundErrors() {
    this.foundErrors = [];
    if (!this.parsedRequests || !this.parsedRequests.length) {
      return;
    }
    for (let i = 0; i < this.parsedRequests.length; i++) {
      const req = this.parsedRequests[i];
      if (!!req.errors && !!req.errors.length) {
        req.errors.forEach((e) => {
          this.foundErrors.push(e.xpath);
        });
      }
    }
  }
  exportErrors() {
    const errors = JSON.stringify(this.foundErrors);
    downloadFile(errors, this.exportName.replace('.png', '.json'));
  }
  readDocument() {
    const fileReader = new FileReader();
    this.parseError = false;
    fileReader.onload = (e) => {
      this.zone.run(() => {
        try {
          const data = this.harService.parse(fileReader.result);
          this.title = data.url;
          this.parsedRequests = data.results;
          this.selectedFileName = this.file.name;
          this.exportName = this.file.name.replace('.har', '.png');
          this.titleService.setTitle(this.exportName.replace(/\..+$/i, ''));
          this.mergeFoundErrors();
        } catch (e) {
          this.title = '';
          this.parsedRequests = [];
          this.parseError = true;
        } finally {
          this.fileSelector.nativeElement.value = '';
          if (!/safari/i.test(navigator.userAgent)) {
            this.fileSelector.nativeElement.type = '';
            this.fileSelector.nativeElement.type = 'file';
          }
        }
      });
    };
    fileReader.readAsText(this.file);
  }
  selectFile() {
    this.fileSelector.nativeElement.click();
    this.title = '';
    this.parsedRequests = [];
    this.file = null;
  }

  isObject(e) {
    if (!e.value) {
      return false;
    }
    return isObject(e.value);
  }
  expandIt(e) {
    e.value = JSON.stringify(e.value, null, ' ');
  }
  getTimeClass(req) {
    switch (req.timeTx) {
      case 'slowest' : return 'table-danger';
      case 'slow' : return 'table-warning';
      case 'critical' : return 'table-danger critical';
      default: return 'table-success';
    }
  }
  screenshot() {
    html2canvas(document.querySelector('#parsed-data')).then(canvas => {
      const link = document.createElement('a');
      link.download = this.exportName;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    });
  }
}
