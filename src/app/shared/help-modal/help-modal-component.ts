import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'help-modal',
  templateUrl: 'help-modal.component.html'
})

export class HelpModalComponent implements OnInit {
  @Input()
  modalId: string;
  @Input()
  title: string;
  @Input()
  closeButton: boolean;
  constructor() { }

  ngOnInit() { }
}
