import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Remote } from 'electron';
import { FileTypeUtils } from 'electron/utils/FileTypeUtils';

@Component({
  selector: 'app-fs-chooser',
  templateUrl: './fs-chooser.component.html',
  styleUrls: ['./fs-chooser.component.sass']
})
export class FileSystemChooserComponent implements OnInit {

  private static extensionsMap: Map<string, any> = new Map([
    ['ROM', { name: 'ROM Images', extensions: FileTypeUtils.getRomExtensions().concat(FileTypeUtils.getZipExtensions())}],
    ['Disk', { name: 'Disk Images', extensions: FileTypeUtils.getDiskExtensions().concat(FileTypeUtils.getZipExtensions())}],
    ['Tape', { name: 'Tape Images', extensions: FileTypeUtils.getTapeExtensions().concat(FileTypeUtils.getZipExtensions())}],
    ['Harddisk', { name: 'Harddisk Images', extensions: FileTypeUtils.getHarddiskExtensions().concat(FileTypeUtils.getZipExtensions())}],
    ['Laserdisc', { name: 'Laserdisc Images', extensions: FileTypeUtils.getLaserdiscExtensions().concat(FileTypeUtils.getZipExtensions())}]
  ]);

  @Input ('directory-mode') directoryMode: boolean;
  @Input ('label') label: string;
  @Input ('filters-type') filtersType: string;
  @Input ('multi-selections') multiSelections: boolean;
  @Output() onChosen: EventEmitter<any> = new EventEmitter<any>();
  private remote: Remote = (<any> window).require('electron').remote;

  constructor() { }

  ngOnInit() {
  }

  browse(clicked: any) {
    const self = this;
    let properties: string[];

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

    let filters: object[];
    if (this.filtersType) {
      filters = [
        FileSystemChooserComponent.extensionsMap.get(this.filtersType)
      ];
    } else {
      filters = [];
    }

    const options: Object = {
      properties: properties,
      filters: filters
    };

    this.remote.dialog.showOpenDialog(this.remote.getCurrentWindow(), options).then((value) => {
      if (!value.canceled) {
        if (this.multiSelections) {
          self.onChosen.emit(value.filePaths);
        } else {
          self.onChosen.emit(value.filePaths[0]);
        }
      }
    });
  }
}
