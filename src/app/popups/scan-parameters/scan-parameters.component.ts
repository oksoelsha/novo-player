import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EmulatorService } from 'src/app/services/emulator.service';
import { GamesService } from 'src/app/services/games.service';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-scan-parameters',
  templateUrl: './scan-parameters.component.html',
  styleUrls: ['./scan-parameters.component.sass']
})
export class ScanParametersComponent extends PopupComponent {

  @Input () popupId: string;
  @Output() parameters: EventEmitter<ScanParameters> = new EventEmitter<ScanParameters>();

  items: string[] = [];
  machines: string[] = [];
  listings: string[] = [];
  selectedOrEnteredListingDisplay: string = "";
  selectedOrEnteredListing: string = "";
  selectedListing: string = "";
  enteredListing: string;
  selectedMachine: string = "";

  constructor(private gamesService: GamesService, private emulatorService: EmulatorService) {
    super();
  }

  open(): void {
    super.open();

    this.gamesService.getListings().then((data: string[]) => {
      this.listings = data;
      this.setSelectedListingAndAdjustForDisplay(data[0]);
    });
    this.emulatorService.getMachines().then((data: string[]) => {
      this.machines = data;
      if (!this.selectedMachine) {
        this.selectedMachine = data[0];
      }
    });

    this.enteredListing = "";
  }

  close(): void {
    this.items = [];

    super.close();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  setSelectedListing(listing: string) {
    this.selectedOrEnteredListingDisplay = this.selectedOrEnteredListing = listing;
    this.enteredListing = "";
  }

  setEnteredListing() {
    if (this.enteredListing.trim()) {
      this.setSelectedListingAndAdjustForDisplay(this.enteredListing, true);
    } else {
      this.enteredListing = "";
    }
    document.getElementById("listings-dropdown").classList.remove("show");
  }

  submitParameters(): void {
    this.parameters.emit(new ScanParameters(this.items, this.selectedOrEnteredListing, this.selectedMachine));
    this.close();
  }

  private setSelectedListingAndAdjustForDisplay(listing: string, appendNew: boolean = false) {
    this.selectedOrEnteredListing = listing;
    if (appendNew) {
      this.selectedOrEnteredListingDisplay = listing + ' (New)';
    } else {
      this.selectedOrEnteredListingDisplay = listing;
    }
  }
}

export class ScanParameters {
  items: string[];
  listing: string;
  machine: string;

  constructor(items: string[], listing: string, machine:string) {
    this.items = items;
    this.listing = listing;
    this.machine = machine;
  }
}