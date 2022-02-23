import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drop-down-with-input',
  templateUrl: './drop-down-with-input.component.html',
  styleUrls: ['../../common-styles.sass', './drop-down-with-input.component.sass']
})
export class DropDownWithInputComponent implements OnChanges {

  @Input() list: string[] = [];
  @Input() defaultLabel: string;
  @Input() defaultNewLabel: string;
  @Input() defaultSelection: string;
  @Output() selection: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('dropdownWithInput', { static: true }) private listingsDropdown: NgbDropdown;

  selectedOrEnteredItemDisplay = '';
  selectedOrEnteredItem = '';
  selectedItem = '';
  enteredItem = '';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.defaultSelection) {
      this.setSelectedItemAndAdjustForDisplay(this.defaultSelection);
      this.selection.emit(this.defaultSelection);
    }
  }

  setSelectedItem(item: string) {
    this.selectedOrEnteredItemDisplay = this.selectedOrEnteredItem = item;
    this.enteredItem = '';
    this.selection.emit(item);
  }

  setEnteredItem(event: KeyboardEvent) {
    const enteredValue: string = this.enteredItem.trim();
    if (enteredValue) {
      const index = this.list.findIndex((e) => e === enteredValue);
      this.setSelectedItemAndAdjustForDisplay(enteredValue, index < 0);
      this.selection.emit(enteredValue);
    } else {
      this.enteredItem = '';
    }

    this.listingsDropdown.close();
    this.enteredItem = '';
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
