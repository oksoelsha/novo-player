import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drop-down-with-input',
  templateUrl: './drop-down-with-input.component.html',
  styleUrls: ['../../common-styles.sass', './drop-down-with-input.component.sass']
})
export class DropDownWithInputComponent {

  @Input ('list') list: string[] = [];
  @Input ('default-label') defaultLabel: string;
  @Input ('default-new-label') defaultNewLabel: string;
  @Input ('default-selection') defaultSelection: string;
  @Output() selection: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('dropdownWithInput', { static: true }) private listingsDropdown: NgbDropdown;

  selectedOrEnteredItemDisplay: string = "";
  selectedOrEnteredItem: string = "";
  selectedItem: string = "";
  enteredItem: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultSelection']) {
      this.setSelectedItemAndAdjustForDisplay(this.defaultSelection);
      this.selection.emit(this.defaultSelection);
    }
  }

  setSelectedItem(item: string) {
    this.selectedOrEnteredItemDisplay = this.selectedOrEnteredItem = item;
    this.enteredItem = "";
    this.selection.emit(item);
  }

  setEnteredItem(event: KeyboardEvent) {
    let enteredValue: string = this.enteredItem.trim();
    if (enteredValue) {
      let index = this.list.findIndex((e) => e == enteredValue);
      this.setSelectedItemAndAdjustForDisplay(enteredValue, index < 0);
      this.selection.emit(enteredValue);
    } else {
      this.enteredItem = "";
    }

    this.listingsDropdown.close();
    event.preventDefault();
  }

  private setSelectedItemAndAdjustForDisplay(item: string, appendNew: boolean = false) {
    this.selectedOrEnteredItem = item;
    if (appendNew) {
      this.selectedOrEnteredItemDisplay = item + ' (New)';
    } else {
      this.selectedOrEnteredItemDisplay = item;
    }
  }
}
