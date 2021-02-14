import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { EmulatorService } from 'src/app/services/emulator.service';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-scan-parameters',
  templateUrl: './scan-parameters.component.html',
  styleUrls: ['./scan-parameters.component.sass']
})
export class ScanParametersComponent implements OnInit {

  @Output() parameters: EventEmitter<ScanParameters> = new EventEmitter<ScanParameters>();

  private topNode: HTMLElement;

  items: string[] = [];
  machines: string[] = [];
  listings: string[] = [];
  selectedOrEnteredListingDisplay: string = "";
  selectedOrEnteredListing: string = "";
  selectedListing: string = "";
  enteredListing: string;
  selectedMachine: string = "";

  constructor(private gamesService: GamesService, private emulatorService: EmulatorService) {}

  ngOnInit() {
    let self = this;
    this.topNode = document.getElementById('scan-parameters-component');

    window.addEventListener('click', function (e: any) {
      if (e.target == self.topNode) {
        self.close();
      }
    });
  }

  open(): void {
    //intercept key board events to prevent them from propagating to the parent window
    document.addEventListener('keyup', this.handleKeyEvents);
    this.topNode.classList.add('scan-parameters-fade');

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
    document.removeEventListener('keyup', this.handleKeyEvents);
    this.topNode.classList.remove('scan-parameters-fade');
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

  private handleKeyEvents(event: any): void {
    event.stopPropagation();
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