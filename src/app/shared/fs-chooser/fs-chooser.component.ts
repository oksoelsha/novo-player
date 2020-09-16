import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Remote } from 'electron';

@Component({
  selector: 'app-fs-chooser',
  templateUrl: './fs-chooser.component.html',
  styleUrls: ['./fs-chooser.component.sass']
})
export class FileSystemChooserComponent implements OnInit {

  @Input ('directory-mode') directoryMode: boolean;
  @Input ('label') label: string;
  @Output() onChosen: EventEmitter<any> = new EventEmitter<any>();
  private remote: Remote = (<any>window).require('electron').remote;

  constructor() { }

  ngOnInit() {
  }

  browse(clicked: any) {
    var self = this;
    var options: Object;

    if (this.directoryMode) {
      options = {
        properties: ['openDirectory']
      }
    } else {
      options = {
        properties: ['openFile']
      }
    }

    this.remote.dialog.showOpenDialog(options).then((value) => {
      if (!value.canceled) {
        self.onChosen.emit(value.filePaths[0]);
      }
    })
  }
}
