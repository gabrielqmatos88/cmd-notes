import { Component, OnInit, Input, ViewChild, NgZone } from '@angular/core';

export const FILE_ERRORS = {
  INVALID_FORMAT: 'invalidFormat',
  PARSE_ERROR: 'parseError',
  BAD_FILE: 'badFile'
};

@Component({
  selector: 'app-file-selector',
  templateUrl: 'file-selector.component.html'
})
export class FileSelectorComponent implements OnInit {
  @Input()
  id: string;
  filePath: string;
  errorReason: string;
  @ViewChild('fileSelector')
  fileSelector: any;

  private file: any;
  constructor(private zone: NgZone) { }
  ngOnInit() { }

  readDocument() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.zone.run(() => {
        try {
          this.filePath = this.file.name;
          const data = JSON.parse((fileReader.result || '').toString());
          console.log(data);
          if (!data || !data.importType || /!(fullist|single)/i.test(data.importType)) {
            this.errorReason = FILE_ERRORS.INVALID_FORMAT;
          }
        } catch (e) {
          this.filePath = '';
          this.file = null;
          this.errorReason = FILE_ERRORS.PARSE_ERROR;
        } finally {
          this.fileSelector.nativeElement.value = '';
          if (!/safari/i.test(navigator.userAgent)) {
            this.fileSelector.nativeElement.type = '';
            this.fileSelector.nativeElement.type = 'file';
          }
        }
      });
    };
    if (!!this.file && /.+\.json$/i.test(this.file.name)) {
      fileReader.readAsText(this.file);
    } else {
      this.errorReason = FILE_ERRORS.BAD_FILE;
    }
  }

  fileChanged(e) {
    if (!!e && e.target && e.target.files && e.target.files[0]) {
      this.file = e.target.files[0];
      this.readDocument();
    }
  }

  selectFile() {
    this.fileSelector.nativeElement.click();
    this.filePath = '';
    this.file = null;
    this.errorReason = '';
  }

}
