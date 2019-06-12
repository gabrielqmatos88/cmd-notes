import { Component, OnInit, Input, ViewChild, NgZone } from '@angular/core';
import { isArray } from 'util';
import { ICommand } from 'src/app/icommand';

export const FILE_ERRORS = {
  INVALID_FORMAT: 'invalidFormat',
  PARSE_ERROR: 'parseError',
  BAD_FILE: 'badFile'
};

@Component({
  selector: 'app-file-selector',
  templateUrl: 'file-selector.component.html',
  styleUrls: ['file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {
  @Input()
  id: string;
  filePath: string;
  errorReason: string;
  @ViewChild('fileSelector')
  fileSelector: any;
  parsed: ICommand[];
  private file: any;
  constructor(private zone: NgZone) { }
  ngOnInit() { }

  validateCommand(data: ICommand): boolean {
    return !!data && !!data.name && !!data.cmdStr;
  }
  analyzeContent(data: any) {
    if (!data || !data.type || !/^(full_list|single)$/i.test(data.type) || !data.content) {
      this.errorReason = FILE_ERRORS.INVALID_FORMAT;
      return;
    }
    if (/^single$/i.test(data.type)) {
      if (!this.validateCommand(data.content)) {
        this.errorReason = FILE_ERRORS.INVALID_FORMAT;
        return;
      }
      this.parsed = [data.content];
    }
    if (/^full_list$/i.test(data.type) && isArray(data.content)) {
      let commands: any[] = data.content;
      commands = commands.filter(this.validateCommand);
      if (!commands || !commands.length) {
        this.errorReason = FILE_ERRORS.INVALID_FORMAT;
        return;
      }
      this.parsed = commands;
    }
  }

  readDocument() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.zone.run(() => {
        try {
          this.filePath = this.file.name;
          const data = JSON.parse((fileReader.result || '').toString());
          this.analyzeContent(data);
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
    this.parsed = null;
    this.file = null;
    this.errorReason = '';
  }

}
