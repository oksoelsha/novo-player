import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-change-listing',
  templateUrl: './change-listing.component.html',
  styleUrls: ['./change-listing.component.sass']
})
export class ChangeListingComponent extends PopupComponent {

  @Input () popupId: string;
  @Input ('game') game: Game;
  @Input ('listings') listings: string[];
  @Output() updatedGame: EventEmitter<Game> = new EventEmitter<Game>();

  destinationListings: string[] = [];
  selectedListing: string = "";

  opened: boolean = false;

  constructor() { 
    super();
  }

  open(): void {
    this.opened = true;
    super.open();

    this.destinationListings  = Object.assign([], this.listings);
    this.destinationListings.splice(this.destinationListings.indexOf(this.game.listing), 1);
//    this.selectedListing = this.destinationListings[0];
  }

  close(): void {
    this.selectedListing = "";

    this.opened = false;
    super.close();
  }

  move() {
    let updatedGame: Game = Object.assign({}, this.game);
    updatedGame.listing = this.selectedListing;

    this.updatedGame.emit(updatedGame);

    this.close();
  }
}
