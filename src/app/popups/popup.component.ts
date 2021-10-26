import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.sass']
})
export class PopupComponent implements OnInit {

  @Input () titleHeader: string;
  @Input () popupId: string;
  @Output() openStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ContentChild(TemplateRef) templateVariable: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
    let self = this;
    window.addEventListener('click', function (e: any) {
      if (e.target == document.getElementById(self.popupId)) {
        self.close();
      }
    });
  }

  open(): void {
    this.openStatus.emit(true);
    document.getElementById(this.popupId).classList.add('popup-fade');
  }

  close(): void {
    this.openStatus.emit(false);
    document.getElementById(this.popupId).classList.remove('popup-fade');
  }
}
