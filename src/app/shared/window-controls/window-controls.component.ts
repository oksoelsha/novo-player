import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Remote } from 'electron';

@Component({
  selector: 'app-window-controls',
  templateUrl: './window-controls.component.html',
  styleUrls: ['./window-controls.component.sass']
})
export class WindowControlsComponent {

  @Input('title-img') titleImg: string;
  private remote: Remote = (<any> window).require('electron').remote;
  maximizedClass = '';

  // the custom window controls were taken from
  // https://github.com/binaryfunt/electron-seamless-titlebar-tutorial
  // and modified to fit in an Electron-Angular app

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.remote.getCurrentWindow().on('maximize', () => {
      this.maximizedClass = 'maximized';

      // we have to access the document directly because changing the maximizedClass
      // value above didn't trigger the two-way binding in Angular
      document.getElementById('titlebar').classList.add('maximized');
    });
    this.remote.getCurrentWindow().on('unmaximize', () => {
      this.maximizedClass = '';

      // the same reason as above
      document.getElementById('titlebar').classList.remove('maximized');
    });
  }

  isOnWindows(): boolean {
    return navigator.platform.startsWith('Win');
  }

  minimizeMainWindow() {
    this.remote.getCurrentWindow().minimize();
  }

  maximizeMainWindow() {
    this.remote.getCurrentWindow().maximize();
  }

  restoreMainWindow() {
    this.remote.getCurrentWindow().restore();
  }

  closeMainWindow() {
    this.remote.getCurrentWindow().close();
  }
}
