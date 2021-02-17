import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.sass']
})
export class PopupComponent implements OnInit {

  @Input () title: string;
  @Input () popupId: string;
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
    //intercept key board events to prevent them from propagating to the parent window
    document.addEventListener('keyup', this.handleKeyEvents);

    document.getElementById(this.popupId).classList.add('popup-fade');
  }

  close(): void {
    document.removeEventListener('keyup', this.handleKeyEvents);

    document.getElementById(this.popupId).classList.remove('popup-fade');
  }

  private handleKeyEvents(event: any): void {
    event.stopPropagation();
  }
}
