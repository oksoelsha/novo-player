import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-change-listing',
  templateUrl: './change-listing.component.html',
  styleUrls: ['./change-listing.component.sass']
})
export class ChangeListingComponent extends PopupComponent {

  @Input() popupId: string;
  @Input() game: Game;
  @Input() listings: string[];
  @Output() newListing: EventEmitter<string> = new EventEmitter<string>();

  destinationListings: string[] = [];
  selectedListing = '';
  opened = false;

  constructor() {
    super();
  }

  open(): void {
    this.opened = true;
    super.open();

    this.destinationListings  = Object.assign([], this.listings);
    this.destinationListings.splice(this.destinationListings.indexOf(this.game.listing), 1);
  }

  close(): void {
    this.selectedListing = '';

    this.opened = false;
    super.close();
  }

  move() {
    this.newListing.emit(this.selectedListing);

    this.close();
  }
}
