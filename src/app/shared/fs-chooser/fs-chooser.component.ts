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
  @Input ('multi-selections') multiSelections: boolean;
  @Output() onChosen: EventEmitter<any> = new EventEmitter<any>();
  private remote: Remote = (<any>window).require('electron').remote;

  constructor() { }

  ngOnInit() {
  }

  browse(clicked: any) {
    var self = this;
    var properties: string[];

    if (this.multiSelections) {
      properties = ['multiSelections'];
    } else {
      properties = [];
    }

    if (this.directoryMode) {
      properties.push('openDirectory');
    } else {
      properties.push('openFile');
    }

    var options: Object = {
      "properties": properties
    }

    this.remote.dialog.showOpenDialog(options).then((value) => {
      if (!value.canceled) {
        if (this.multiSelections) {
          self.onChosen.emit(value.filePaths);
        } else {
          self.onChosen.emit(value.filePaths[0]);
        }
      }
    })
  }
}
