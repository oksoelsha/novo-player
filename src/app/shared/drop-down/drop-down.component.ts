import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['../../common-styles.sass', './drop-down.component.sass']
})
export class DropDownComponent {

  @Input ('list') list: string[];
  @Input ('selected-item') selectedItem: string;
  @Input ('default-label') defaultLabel: string;
  @Input ('reset-button') resetButton: boolean;
  @Output() selection: EventEmitter<string> = new EventEmitter<string>();
  @ViewChildren('dropDownItem') dropDownItems: QueryList<ElementRef>;

  private accumulatedPressedKeys = '';
  private quickTypeTimer: NodeJS.Timer = null;

  constructor() { }

  processKeyup(event: KeyboardEvent) {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && (
      (event.key >= 'a' && event.key <= 'z') || (event.key >= '0' && event.key <= '9') ||
      (event.key >= 'A' && event.key <= 'Z'))) {
        if (this.quickTypeTimer != null) {
          clearTimeout(this.quickTypeTimer);
        }
        this.accumulatedPressedKeys += event.key;
        this.quickTypeTimer = setTimeout(() => {
          this.jumpToNearestItem(this.accumulatedPressedKeys);
          this.accumulatedPressedKeys = '';
        }, 300);
      } else if (event.key === 'Enter') {
        event.stopPropagation();
      }
  }

  handleSelection(selection: string) {
    this.selectedItem = selection;
    this.selection.emit(selection);
  }

  resetSelection() {
    this.selectedItem = '';
    this.selection.emit('');
  }

  private jumpToNearestItem(accumulatedPressedKeys: string) {
    let index: number;
    for (index = 0; index < this.list.length && !this.list[index].toLowerCase().startsWith(accumulatedPressedKeys.toLowerCase()); index++) {}
    if (index < this.list.length) {
      this.dropDownItems.toArray()[index].nativeElement.focus();
    }
  }
}
