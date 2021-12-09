import { Component, Input } from '@angular/core';
import { Remote } from 'electron';

@Component({
  selector: 'app-web-link',
  templateUrl: './web-link.component.html',
  styleUrls: ['./web-link.component.sass']
})
export class WebLinkComponent {

  @Input() address: string;
  @Input() label: string;

  private readonly remote: Remote = window.require('electron').remote;

  constructor() { }

  openInBrowser() {
    this.remote.shell.openExternal(this.address);
  }
}
