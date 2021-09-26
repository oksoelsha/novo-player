import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GamesService } from 'src/app/services/games.service';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-manage-listings',
  templateUrl: './manage-listings.component.html',
  styleUrls: ['../../common-styles.sass', './manage-listings.component.sass']
})
export class ManageListingsComponent extends PopupComponent {

  @Input('listings') listings: string[];
  @Output() updatedListing: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('listingRenameInput', { static: false }) private listingRenameInput: ElementRef;
  @ViewChild('listingsTable', { static: true }) private listingsTable: ElementRef;

  renamedListing: string;
  renameMode: boolean = false;
  deleteMode: boolean = false;
  selectedListing: string;
  listingsSelectionMap: Map<string, boolean> = new Map();

  constructor(private gamesService: GamesService) {
    super();
  }

  open(): void {
    super.open();

    this.resetState();
  }

  close(): void {
    this.resetState();

    super.close();
  }

  enableRenameMode(listing: string) {
    this.resetState();
    this.renameMode = true;
    this.setSelectedListing(listing);
    this.renamedListing = listing;
    setTimeout(() => {
      this.listingRenameInput.nativeElement.focus();
      this.listingRenameInput.nativeElement.select();
    }, 0);
  }

  enableDeleteMode(listing: string) {
    this.resetState();
    this.deleteMode = true;
    this.setSelectedListing(listing);
  }

  renameListing(event: any) {
    if (this.renamedListing && !this.renamedListing.startsWith(' ')) {
      this.gamesService.renameListing(this.selectedListing, this.renamedListing.trim()).then((err: boolean) => {
        if (err) {
          //error TODO - show an error?
        } else {
          let oldName= this.selectedListing;
          let newName = this.renamedListing;
          this.removeFromListings(oldName);
          this.addToListings(newName);
          this.resetState();
          setTimeout(() => {
            this.adjustScrollForRenamedListing(newName);
          }, 0);
      
          this.updatedListing.emit({oldListingName: oldName, newListingName: newName});
        }
      });
  
      event.stopPropagation();
    }
  }

  deleteListing() {
    this.gamesService.deleteListing(this.selectedListing).then((removed: boolean) => {
      if (removed) {
        this.removeFromListings(this.selectedListing);

        this.updatedListing.emit({deletedListingName: this.selectedListing});
      }
      this.resetState();
    });
  }

  resetState() {
    this.renameMode = false;
    this.deleteMode = false;
    this.listingsSelectionMap.clear();
    this.renamedListing = "";
    this.selectedListing = "";
  }

  private setSelectedListing(listing: string) {
    this.selectedListing = listing;
    this.listingsSelectionMap.set(listing, true);
  }

  private removeFromListings(listing: string) {
    this.listings.splice(this.listings.indexOf(listing, 0), 1);
  }

  private addToListings(listing: string) {
    let index: number;
    for (index = 0; index < this.listings.length && this.listings[index].toLowerCase().localeCompare(listing.toLowerCase()) < 0; index++);
    if (index < this.listings.length) {
      this.listings.splice(index, 0, listing);
    } else {
      this.listings.push(listing);
    }      
  }

  //This method can be moved to a utility class because a similar one is used in the home component
  private adjustScrollForRenamedListing(listing: string) {
    let listingsTableTop: number = this.listingsTable.nativeElement.getBoundingClientRect().top;
    let listingsTableBottom: number = this.listingsTable.nativeElement.getBoundingClientRect().bottom;
    let tableCellTop: number = document.getElementById(listing).getBoundingClientRect().top;
    let tableCellBottom: number = document.getElementById(listing).getBoundingClientRect().bottom;

    if (tableCellTop < listingsTableTop) {
      this.listingsTable.nativeElement.scrollTop = (tableCellTop + this.listingsTable.nativeElement.scrollTop) - listingsTableTop;
    } else if (tableCellBottom > listingsTableBottom) {
      this.listingsTable.nativeElement.scrollTop = (tableCellBottom + this.listingsTable.nativeElement.scrollTop) - listingsTableBottom;
    }
  }
}
