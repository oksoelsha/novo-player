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

  processKeyup(event: KeyboardEvent) {
    if (event.key.length == 1 && !event.ctrlKey && !event.metaKey && (
      (event.key >= 'a' && event.key <= 'z') || (event.key >= '0' && event.key <= '9') ||
      (event.key >= 'A' && event.key <= 'Z'))) {
        let index: number;
        for (index = 0; index < this.list.length && !this.list[index].toLowerCase().startsWith(event.key); index++);
        if (index < this.list.length) {
          document.getElementById(this.getIdFromItemName(this.list[index])).focus();
        }
      } else if (event.key == 'Enter') {
        event.stopPropagation();
      }
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

  private getIdFromItemName(itemName: string): string {
    return itemName.split(' ').join('_');
  }
}
