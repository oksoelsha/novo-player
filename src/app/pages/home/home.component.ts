import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GamesService } from 'src/app/services/games.service';
import { GameSecondaryData } from 'src/app/models/secondary-data';
import { ScannerService } from 'src/app/services/scanner.service';
import { AlertsService } from 'src/app/shared/alerts/alerts.service';
import { ScanParametersComponent, ScanParameters } from 'src/app/popups/scan-parameters/scan-parameters.component';
import { ManageListingsComponent } from 'src/app/popups/manage-listings/manage-listings.component';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/models/settings';
import { MediaEditComponent } from 'src/app/popups/media-edit/media-edit.component';
import { HardwareEditComponent } from 'src/app/popups/hardware-edit/hardware-edit.component';
import { ChangeListingComponent } from 'src/app/popups/change-listing/change-listing.component';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../common-styles.sass', './home.component.sass']
})
export class HomeComponent implements OnInit {

  @ViewChild('gameNameEditInput', { static: false }) private gameNameEdit: ElementRef;
  @ViewChild('scanParameters') scanParameters: ScanParametersComponent;
  @ViewChild('manageListings') manageListings: ManageListingsComponent;
  @ViewChild('mediaEdit') mediaEdit: MediaEditComponent;
  @ViewChild('hardwareEdit') hardwareEdit: HardwareEditComponent;
  @ViewChild('changeListing') changeListing: ChangeListingComponent;
  @ViewChild('searchDropdown', { static: true }) private searchDropdown: NgbDropdown;
  @ViewChild('dragArea', { static: false }) private dragArea: ElementRef;

  private readonly noScreenshotImage1: GameSecondaryData = new GameSecondaryData("assets/noscrsht.png", "", null);
  private readonly noScreenshotImage2: GameSecondaryData = new GameSecondaryData("", "assets/noscrsht.png", null);
  private readonly noScreenshotData: GameSecondaryData = new GameSecondaryData("", "", null);

  private toggle: boolean = false;
  private gamesTable: Element;
  private gameQuickSearch: string = ""
  private quickTypeTimer: NodeJS.Timer = null;

  private draggedFilesAndFolders: string[] = [];
  private dragCounter: number = 0;

  selectedListing: string = ""
  games: Game[] = [];
  gamesEditMode: Map<string, boolean> = new Map();
  editedGameName: string;
  selectedGame: Game;
  lastRemovedGame: Game = null;
  screenshot_a_1: GameSecondaryData;
  screenshot_a_2: GameSecondaryData;
  screenshot_b_1: GameSecondaryData;
  screenshot_b_2: GameSecondaryData;
  transparent1: string = "";
  transparent2: string = "transparent";
  scanRunning: boolean = false;
  listings: string[] = [];
  openMenuEventCounter: number = 0;
  searchMenuOpen: boolean = false;
  popupOpen: boolean = false;
  isOpenMSXPathDefined: boolean;
  isWebMSXPathDefined: boolean;
  musicFiles: string[] = [];
  selectedMusicFile: string;

  constructor(private gamesService: GamesService,
    private scanner: ScannerService,
    private alertService: AlertsService,
    private settingsService: SettingsService,
    private router: Router) { }

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
    if (this.canHandleEvents()) {
      if (this.selectedGame != null) {
        if (event.key == 'ArrowUp') {
          var index = this.games.indexOf(this.selectedGame);
          if (index > 0) {
            this.showInfo(this.games[index - 1]);
          }
        } else if (event.key == 'ArrowDown') {
          var index = this.games.indexOf(this.selectedGame);
          if (index < (this.games.length - 1)) {
            this.showInfo(this.games[index + 1]);
          }
        }
      } else if (event.key == 'ArrowDown' && this.games.length > 0) {
        this.selectedGame = this.games[0];
        this.showInfo(this.games[0]);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  keydownEvent(event: KeyboardEvent) {
    if (this.canHandleEvents()) {
      if (event.key.length == 1 && !this.ctrlOrCommandKey(event) && (
        (event.key >= 'a' && event.key <= 'z') || (event.key >= '0' && event.key <= '9') ||
        (event.key >= 'A' && event.key <= 'Z') || event.key == ' ' || event.key == '-')) {
        if (this.quickTypeTimer != null) {
          clearTimeout(this.quickTypeTimer);
        }
        this.gameQuickSearch += event.key;
        this.quickTypeTimer = setTimeout(() => {
          this.jumpToNearestGame(this.gameQuickSearch);
          this.gameQuickSearch = "";
        }, 600)
      } else if (this.ctrlOrCommandKey(event) && (event.key == 'f' || event.key == 'F')) {
        this.searchDropdown.open();
      } else if (this.selectedGame != null) {
        if (event.key == 'Enter') {
          this.launch(this.selectedGame);
        } else if (event.key == 'Delete') {
          this.remove(event, this.selectedGame);
        }
      }
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (this.canHandleEvents()) {
      event.preventDefault();
      event.stopPropagation();
      this.dragArea.nativeElement.classList.add('drag-over');
    }
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    if (this.canHandleEvents()) {
      event.preventDefault();
      event.stopPropagation();
      this.dragCounter++;
      this.dragArea.nativeElement.classList.add('drag-over');
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    if (this.canHandleEvents()) {
      event.preventDefault();
      event.stopPropagation();
      this.dragCounter--;
      if (this.dragCounter == 0) {
        this.dragArea.nativeElement.classList.remove('drag-over');
      }
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    if (this.canHandleEvents()) {
      event.preventDefault();
      event.stopPropagation();
      this.dragCounter = 0;
      this.dragArea.nativeElement.classList.remove('drag-over');
      let files = event.dataTransfer.files;
      if (files.length > 0) {
        this.draggedFilesAndFolders = Array.from(files).map(f => f.path);
        this.scanParameters.open();
      }
    }
  }

  ngOnInit() {
    this.initialize();
    this.gamesTable = document.getElementById("games-table-data");

    if (sessionStorage.getItem('lastRemovedGame') != null) {
      this.lastRemovedGame = JSON.parse(sessionStorage.getItem('lastRemovedGame'));
    }

    var self = this;
    this.settingsService.getSettings().then((settings: Settings) => {
      this.gamesService.getListings().then((data: string[]) => {
        this.listings = data;
        let gameSha1Code:string = null;
        if (sessionStorage.getItem('selectedListing') != null) {
          self.selectedListing = sessionStorage.getItem('selectedListing');
          if (sessionStorage.getItem('selectedGame') != null) {
            gameSha1Code = JSON.parse(sessionStorage.getItem('selectedGame')).sha1Code;
          }
        } else if (!settings.defaultListing || !settings.defaultListing.trim()) {
          if (data.length > 0) {
            self.selectedListing = data[0];
          }
        } else {
          self.selectedListing = settings.defaultListing;
        }
        self.getGames(this.selectedListing, gameSha1Code);
      });
      this.isOpenMSXPathDefined = settings.openmsxPath != null && settings.openmsxPath.trim() != "";
      this.isWebMSXPathDefined = settings.webmsxPath != null && settings.webmsxPath.trim() != "";
    });
  }

  handleOpenMenuEvents(opened:boolean) {
    opened? this.openMenuEventCounter++ : this.openMenuEventCounter--;
  }

  setSelectedListing(listing: string) {
    if (listing != this.selectedListing) {
      this.selectedGame = null;
      sessionStorage.removeItem('selectedGame');
      this.setScreenshots(this.noScreenshotData);

      this.selectedListing = listing;
      this.getGames(listing);
    }
  }

  getGames(listing: string, sha1Code: string = null) {
    this.selectedListing = listing;
    sessionStorage.setItem('selectedListing', listing);
    this.gamesService.getGames(this.selectedListing).then((data: Game[]) => {
      this.games = data;
      this.gamesEditMode.clear();
      for (let game of data) {
        this.gamesEditMode.set(game.sha1Code, false);
        if (sha1Code && game.sha1Code == sha1Code) {
          setTimeout(() => {
            this.showInfo(game);
          },0);
        }
      }
    });
  }

  launch(game: Game) {
    this.gamesService.launchGame(game).then((errorMessage: string) => {
      if (errorMessage) {
        this.alertService.failure("Failed to start openMSX for: " + game.name + " [" + errorMessage + "]");
      } else {
        this.alertService.info("openMSX window closed for: " + game.name);
      }
    });
  }

  launchWebmsx(game: Game) {
    this.router.navigate(['./wmsx', { gameParams: JSON.stringify(this.selectedGame) }], { queryParams: this.getWebMSXParams() });
  }

  processKeyEventsOnTable(event: any) {
    if (!this.isEditMode()) {
      event.preventDefault();
    }
  }

  edit(game: Game) {
    this.editedGameName = game.name;
    this.gamesEditMode.set(game.sha1Code, true);
    setTimeout(() => {
      this.gameNameEdit.nativeElement.focus();
      this.gameNameEdit.nativeElement.select();
    },0);
  }

  processNewGameName(event: any) {
    if (this.editedGameName && !this.editedGameName.startsWith(' ')) {
      let renamedGame: Game = Object.assign({}, this.selectedGame);
      renamedGame.name = this.editedGameName.trim();
      this.update(this.selectedGame, renamedGame);
      event.stopPropagation();
      this.editedGameName = "";
      this.gamesEditMode.set(this.selectedGame.sha1Code, false);
    }
  }

  cancelEditMode() {
    this.gamesEditMode.set(this.selectedGame.sha1Code, false);
    this.editedGameName = "";
  }

  remove(event: any, game: Game) {
    event.stopPropagation();
    this.gamesService.removeGame(game).then((removed: boolean) => {
      if (removed) {
        this.alertService.success("Game was removed: " + game.name);
        this.lastRemovedGame = game;
        if (this.selectedGame != null && game.sha1Code == this.selectedGame.sha1Code) {
          this.initialize();
        }
        sessionStorage.setItem('lastRemovedGame', JSON.stringify(game));
        this.removeGameFromList(game);
      } else {
        this.alertService.failure("Game was not removed: " + game.name);
      }
    })
  }

  undoRemove() {
    if (this.lastRemovedGame != null) {
      this.gamesService.saveGame(this.lastRemovedGame).then((added: boolean) => {
        if (added) {
          this.alertService.success("Game was restored: " + this.lastRemovedGame.name);
          if (this.lastRemovedGame.listing == this.selectedListing) {
            this.addGameToSortedList(this.lastRemovedGame);
          }
          this.addListingToListings(this.lastRemovedGame.listing);
          sessionStorage.removeItem('lastRemovedGame');
          this.lastRemovedGame = null;
        } else {
          this.alertService.failure("Game was not restored: " + this.lastRemovedGame.name);
        }
      });
    }
  }

  update(oldGame: Game, newGame: Game) {
    this.gamesService.updateGame(oldGame, newGame).then((err: boolean) => {
      if (err) {
        this.alertService.failure("Game was not updated: " + oldGame.name + " - you cannot change a game's main file");
      } else {
        this.alertService.success("Game was updated: " + newGame.name);
        this.removeGameFromList(oldGame, false);
        this.addGameToSortedList(newGame);
        setTimeout(() => {
          this.showInfo(newGame);
        },0);
      }
    });
  }

  move(oldGame: Game, newGame: Game) {
    this.gamesService.updateGame(oldGame, newGame).then(() => {
      this.alertService.success("Game was moved: " + newGame.name + " -> " + newGame.listing);
      this.removeGameFromList(oldGame);
      this.initialize();
      this.addListingToListings(newGame.listing);
    });
  }

  updateListings(data: any) {
    console.log(data)
  }

  showInfo(game: Game) {
    this.selectedGame = game;
    sessionStorage.setItem('selectedGame', JSON.stringify(game));
    this.adjustScrollForSelectedGame(game);
    this.gamesService.getSecondaryData(game).then((secondaryData) => {
      this.setScreenshots(secondaryData);
      this.setMusicFiles(secondaryData);
    });

    //reset the open menu counter because there's a case where it doesn't get reset (by subtracting 1 on openChange event)
    //with the closing of the menu. That case is for the game music tracks menu where the closing menu event does not fire
    //if the if-statement around the html segment evaluates to false after clicking on a different game without music
    this.openMenuEventCounter = 0;
  }

  showFoundGame(game: Game) {
    if (game.listing == this.selectedListing) {
      this.showInfoBySha1Code(game.sha1Code);
    } else {
      this.getGames(game.listing, game.sha1Code);
    }

    //this is needed for when the Enter key is pressed to select a game from the search menu
    this.searchDropdown.close();
  }

  getGameMedium(game: Game): string {
    if (game.romA != null) {
      return "assets/images/media/rom.png"
    } else if (game.diskA != null) {
      return "assets/images/media/disk.png"
    } else if (game.tape != null) {
      return "assets/images/media/tape.png"
    } else if (game.harddisk != null) {
      return "assets/images/media/harddisk.png"
    } else if (game.laserdisc != null) {
      return "assets/images/media/laserdisc.png"
    }
  }

  startScan(parameters: ScanParameters) {
    this.alertService.info("Started scanning process...");
    this.scanRunning = true;
    this.scanner.scan(parameters).then(result => {
      this.alertService.info("Total games added = " + result)

      this.gamesService.getListings().then((data: string[]) => {
        this.listings = data;
        if (!this.selectedListing) {
          //this can happen after a scan that adds the first listing
          this.selectedListing = this.listings[0];
        }
        this.getGames(this.selectedListing);
      });
      this.scanRunning = false;
    });
  }

  selectedGameClass(game: Game): string {
    if (this.selectedGame != null && game.sha1Code == this.selectedGame.sha1Code) {
      return "selected-game";
    } else {
      return "";
    }
  }

  setSelectedMusicFile(musicFile: string) {
    this.selectedMusicFile = musicFile;
  }

  getMusicName(musicFile: string) {
    let firstIndex = musicFile.lastIndexOf('/') + 1;
    let lastIndex = musicFile.lastIndexOf('.');
    if (lastIndex < firstIndex) {
      return "Unknown";
    }
    let filename = musicFile.substring(firstIndex, lastIndex);
    let separaterIndex = filename.indexOf('_');
    if (separaterIndex < 0) {
      return filename;
    } else {
      return filename.substring(separaterIndex + 1);
    }
  }

  private initialize() {
    this.selectedGame = null;
    this.screenshot_a_1 = this.screenshot_a_2 = this.noScreenshotImage1;
    this.screenshot_b_1 = this.screenshot_b_2 = this.noScreenshotImage2;
  }

  private canHandleEvents(): boolean {
    return !this.isEditMode() && !(this.openMenuEventCounter > 0) && !this.popupOpen;
  }

  private ctrlOrCommandKey(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.metaKey;
  }

  private setScreenshots(secondaryData: GameSecondaryData) {
    if (this.toggle) {
      this.screenshot_a_1 = this.getScreenshot1Data(secondaryData);
      this.screenshot_b_1 = this.getScreenshot2Data(secondaryData);
      this.transparent1 = "";
      this.transparent2 = "transparent";
    } else {
      this.screenshot_a_2 = this.getScreenshot1Data(secondaryData);
      this.screenshot_b_2 = this.getScreenshot2Data(secondaryData);
      this.transparent1 = "transparent";
      this.transparent2 = "";
    }
    this.toggle = !this.toggle;
  }

  private setMusicFiles(secondaryData: GameSecondaryData) {
    this.musicFiles = secondaryData.musicFiles;
    if (this.musicFiles.length > 0) {
      this.selectedMusicFile = this.musicFiles[0];
    } else {
      this.selectedMusicFile = null;
    }
  }

  private adjustScrollForSelectedGame(game: Game) {
    let gamesTableTop: number = this.gamesTable.getBoundingClientRect().top;
    let gamesTableBottom: number = this.gamesTable.getBoundingClientRect().bottom;
    let tableCellTop: number = document.getElementById(game.sha1Code).getBoundingClientRect().top;
    let tableCellBottom: number = document.getElementById(game.sha1Code).getBoundingClientRect().bottom;

    if (tableCellTop < gamesTableTop) {
      this.gamesTable.scrollTop = (tableCellTop + this.gamesTable.scrollTop) - gamesTableTop;
    } else if (tableCellBottom > gamesTableBottom) {
      this.gamesTable.scrollTop = (tableCellBottom + this.gamesTable.scrollTop) - gamesTableBottom;
    }
  }

  private getScreenshot1Data(screenshots: GameSecondaryData): GameSecondaryData {
    if (!screenshots.screenshot1) {
      return this.noScreenshotImage1;
    } else {
      return screenshots;
    }
  }

  private getScreenshot2Data(screenshots: GameSecondaryData): GameSecondaryData {
    if (!screenshots.screenshot2) {
      return this.noScreenshotImage2;
    } else {
      return screenshots;
    }
  }

  private removeGameFromList(game: Game, switchListingIfLastGameInCurrentListing: boolean = true) {
    this.games.splice(this.games.findIndex((e) => e.sha1Code == game.sha1Code), 1);

    if (switchListingIfLastGameInCurrentListing && this.games.length == 0) {
      this.listings.splice(this.listings.findIndex((e) => e == this.selectedListing), 1);
      if (this.listings.length > 0) {
        this.selectedListing = this.listings[0];
        this.getGames(this.selectedListing);
      }
    }
  }

  private addGameToSortedList(game: Game) {
    let index: number;
    for (index = 0; index < this.games.length && this.games[index].name.toLowerCase().localeCompare(game.name.toLowerCase()) < 0; index++);
    if (index < this.games.length) {
      this.games.splice(index, 0, game);
    } else {
      this.games.push(game);
    }
  }

  private addListingToListings(listing: string) {
    //add listing to listings if it didn't exist there
    if (this.listings.findIndex((e) => e == listing) < 0) {
      let index: number;
      for (index = 0; index < this.listings.length && this.listings[index].toLowerCase().localeCompare(listing.toLowerCase()) < 0; index++);
      this.listings.splice(index, 0, listing);
    }
  }

  private jumpToNearestGame(charachters: string) {
    let index: number;
    for (index = 0; index < this.games.length && !this.games[index].name.toLowerCase().startsWith(charachters.toLowerCase()); index++);
    if (index < this.games.length) {
      this.showInfo(this.games[index]);
    }
  }

  private isEditMode(): boolean {
    return this.selectedGame && this.gamesEditMode.get(this.selectedGame.sha1Code);
  }

  private showInfoBySha1Code(sha1Code: string) {
    this.games.filter(g => g.sha1Code == sha1Code).forEach(match => this.showInfo(match));
  }

  private getWebMSXParams(): any {
    var webMSXParams = {};
    if (this.selectedGame.romA != null) {
      webMSXParams["ROM"] = this.selectedGame.romA;
    }
    if (this.selectedGame.diskA != null) {
      webMSXParams["DISK"] = this.selectedGame.diskA;
    }
    if (this.selectedGame.extensionRom == "scc") {
      webMSXParams["PRESETS"] = "SCC";
    }
    if (this.selectedGame.tape != null) {
      webMSXParams["TAPE"] = this.selectedGame.tape;
    }
    return webMSXParams;
  }
}
