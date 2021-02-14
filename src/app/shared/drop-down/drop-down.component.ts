import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.sass']
})
export class DropDownComponent implements OnInit {

  @Input ('list') list: string[];
  @Input ('selected-item') selectedItem: string;
  @Input ('default-label') defaultLabel: string;
  @Input ('reset-button') resetButton: boolean;
  @Output() selection: EventEmitter<string> = new EventEmitter<string>();

  private mainButtonDisplay: string;

  constructor() { }

  ngOnInit(): void {
    this.mainButtonDisplay = this.defaultLabel;
  }

  handleSelection(selection: string) {
    this.selectedItem = selection;
    this.selection.emit(selection);
  }

  resetSelection() {
    this.selectedItem = "";
    this.mainButtonDisplay = this.defaultLabel;
    this.selection.emit("");
  }
}
