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
  mergeMode: boolean = false;
  selectedListing: string;
  listingsSelectionMap: Map<string, boolean> = new Map();
  listingToMergeFrom: string;
  listingToMergeTo: string;

  public static readonly mode = {
    delete: 0,
    rename:1,
    merge: 2
  };

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
      //first check if the new name matches another listing -> in this case prompt for merge
      if (this.listings.indexOf(this.renamedListing.trim(), 0) >= 0) {
        this.enableMergeMode();
      } else {
        this.doRenameListing(this.selectedListing, this.renamedListing.trim(), false);
      }
      event.stopPropagation();
    }
  }

  deleteListing() {
    this.gamesService.deleteListing(this.selectedListing).then((removed: boolean) => {
      if (removed) {
        this.removeFromListings(this.selectedListing);
        this.updatedListing.emit({ mode: ManageListingsComponent.mode.delete, oldListingName: this.selectedListing });
      }
      this.resetState();
    });
  }

  mergeListings() {
    this.doRenameListing(this.listingToMergeFrom, this.listingToMergeTo, true);
    this.resetMergeMode();
  }

  resetState() {
    this.renameMode = false;
    this.deleteMode = false;
    this.listingsSelectionMap.clear();
    this.renamedListing = "";
    this.selectedListing = "";
  }

  resetMergeMode() {
    this.mergeMode = false;
    this.listingToMergeFrom = null;
    this.listingToMergeTo = null;
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

  private doRenameListing(oldName: string, newName: string, isMergeMode: boolean) {
    this.gamesService.renameListing(oldName, newName).then((err: boolean) => {
      if (err) {
        //show an error?
      } else {
        this.removeFromListings(oldName);
        if (!isMergeMode) {
          this.addToListings(newName);
        }
        this.resetState();
        setTimeout(() => {
          this.adjustScrollForRenamedListing(newName);
        }, 0);

        if (isMergeMode) {
          this.updatedListing.emit({ mode: ManageListingsComponent.mode.merge, oldListingName: oldName, newListingName: newName });
        } else {
          this.updatedListing.emit({ mode: ManageListingsComponent.mode.rename, oldListingName: oldName, newListingName: newName });
        }
      }
    });
  }

  private enableMergeMode() {
    this.mergeMode = true;

    this.listingToMergeFrom = this.selectedListing;
    this.listingToMergeTo = this.renamedListing.trim();
  }
}
