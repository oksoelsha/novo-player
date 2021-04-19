import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GamesService } from 'src/app/services/games.service';
import { GameSecondaryData } from 'src/app/models/secondary-data';
import { ScannerService } from 'src/app/services/scanner.service';
import { GameUtils } from 'src/app/models/game-utils';
import { AlertsService } from 'src/app/shared/alerts/alerts.service';
import { ScanParametersComponent, ScanParameters } from 'src/app/popups/scan-parameters/scan-parameters.component';
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
  @ViewChild('gameDetailSimpleText', { static: true }) private gameDetailSimpleText: TemplateRef<object>;
  @ViewChild('gameDetailFiles', { static: true }) private gameDetailFiles: TemplateRef<object>;
  @ViewChild('gameDetailMedium', { static: true }) private gameDetailMedium: TemplateRef<object>;
  @ViewChild('gameDetailSize', { static: true }) private gameDetailSize: TemplateRef<object>;
  @ViewChild('gameDetailCountry', { static: true }) private gameDetailCountry: TemplateRef<object>;
  @ViewChild('gameDetailGenerations', { static: true }) private gameDetailGenerations: TemplateRef<object>;
  @ViewChild('gameDetailSounds', { static: true }) private gameDetailSounds: TemplateRef<object>;
  @ViewChild('gameDetailGenres', { static: true }) private gameDetailGenres: TemplateRef<object>;
  @ViewChild('gameDetailGenerationMSXLink', { static: true }) private gameDetailGenerationMSXLink: TemplateRef<object>;

  @ViewChild('gameNameEditInput', { static: false }) private gameNameEdit: ElementRef;
  @ViewChild('scanParameters') scanParameters: ScanParametersComponent;
  @ViewChild('mediaEdit') mediaEdit: MediaEditComponent;
  @ViewChild('hardwareEdit') hardwareEdit: HardwareEditComponent;
  @ViewChild('changeListing') changeListing: ChangeListingComponent;
  @ViewChild('searchDropdown', { static: true }) private searchDropdown: NgbDropdown;

  private readonly noScreenshotImage1: GameSecondaryData = new GameSecondaryData("assets/noscrsht.png", "", null);
  private readonly noScreenshotImage2: GameSecondaryData = new GameSecondaryData("", "assets/noscrsht.png", null);
  private readonly noScreenshotData: GameSecondaryData = new GameSecondaryData("", "", null);
  private readonly fileFields: string[] = ['romA', 'romB', 'diskA', 'diskB', 'tape', 'harddisk', 'laserdisc'];

  private selectedGameMedium: Promise<string>;
  private toggle: boolean = false;
  private gamesTable: Element;
  private gameQuickSearch: string = ""
  private quickTypeTimer: NodeJS.Timer = null;

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
  openMenu: boolean = false;
  searchMenuOpen: boolean = false;
  isOpenMSXPathDefined: boolean;
  isWebMSXPathDefined: boolean;
  musicFiles: string[];
  selectedMusicFile: string;

  private readonly gameDetails = [
    { name: "Common Name", value: "title", blockName: "gameDetailSimpleText" },
    { name: "Files", blockName: "gameDetailFiles" },
    { name: "Medium", blockName: "gameDetailMedium" },
    { name: "System", value: "system", blockName: "gameDetailSimpleText" },
    { name: "Company", value: "company", blockName: "gameDetailSimpleText" },
    { name: "Year", value: "year", blockName: "gameDetailSimpleText" },
    { name: "Country", value: "country", blockName: "gameDetailCountry" },
    { name: "SHA1", value: "sha1Code", blockName: "gameDetailSimpleText" },
    { name: "Size", value: "size", blockName: "gameDetailSize" },
    { name: "Generations", value: "generations", blockName: "gameDetailGenerations" },
    { name: "Sound", value: "sounds", blockName: "gameDetailSounds" },
    { name: "Genres", value: "genre1", blockName: "gameDetailGenres" },
    { name: "Dump", value: "dump", blockName: "gameDetailSimpleText" },
    { name: "Mapper", value: "mapper", blockName: "gameDetailSimpleText" },
    { name: "Start", value: "start", blockName: "gameDetailSimpleText" },
    { name: "Remark", value: "remark", blockName: "gameDetailSimpleText" },
    { name: "Generation-MSX", value: "generationMSXId", blockName: "gameDetailGenerationMSXLink" },
  ]

  private readonly countryFlags: Map<string, string> = new Map([
    ["BR", "pt_BR"],
    ["DE", "de_DE"],
    ["ES", "es_ES"],
    ["FR", "fr_FR"],
    ["GB", "UK"],
    ["HK", "HK"],
    ["IT", "it_IT"],
    ["JP", "ja_JP"],
    ["KR", "ko_KR"],
    ["KW", "KW"],
    ["NL", "nl_NL"],
    ["PT", "PT"],
    ["RU", "ru_RU"],
    ["SA", "SA"],
    ["SE", "sv_SE"],
    ["UK", "UK"],
    ["US", "en_US"],
    ["TW", "zh_TW"],
    ["CA", "CA"],
    ["EU", "EU"]
  ]);

  constructor(private gamesService: GamesService,
    private scanner: ScannerService,
    private alertService: AlertsService,
    private settingsService: SettingsService,
    private router: Router) { }

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
    if (!this.isEditMode() && !this.openMenu) {
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
    if (!this.isEditMode() && !this.openMenu) {
      if (event.key.length == 1 && !event.ctrlKey && !event.metaKey && (
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
      } else if (event.ctrlKey && (event.key == 'f' || event.key == 'F')) {
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
        if (!settings.defaultListing || !settings.defaultListing.trim()) {
          if (data.length > 0) {
            self.selectedListing = data[0];
          }
        } else {
          self.selectedListing = settings.defaultListing;
        }
        self.getGames(this.selectedListing);
      });
      this.isOpenMSXPathDefined = settings.openmsxPath != null && settings.openmsxPath.trim() != "";
      this.isWebMSXPathDefined = settings.webmsxPath != null && settings.webmsxPath.trim() != "";
    });
  }

  setSelectedListing(listing: string) {
    this.selectedGame = null;
    this.setScreenshots(this.noScreenshotData);

    this.selectedListing = listing;
    this.getGames(listing)
  }

  getGames(listing: string, sha1Code: string = null) {
    this.selectedListing = listing;
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

  getFilteredGameDetails() {
    return this.gameDetails.filter(d => d.value == null ||
      (this.selectedGame[d.value] != null && this.selectedGame[d.value] != 0))
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
    this.gamesService.updateGame(oldGame, newGame).then(() => {
      this.alertService.success("Game was updated: " + newGame.name);
      this.removeGameFromList(oldGame, false);
      this.addGameToSortedList(newGame);
      setTimeout(() => {
        this.showInfo(newGame);
      },0);
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

  showInfo(game: Game) {
    this.selectedGame = game;
    this.setSelectedGameMedium();
    this.adjustScrollForSelectedGame(game);
    this.gamesService.getSecondaryData(game).then((secondaryData) => {
      this.setScreenshots(secondaryData);
      this.setMusicFiles(secondaryData);
    });
  }

  isDisplayGenerationMSX() {
    return this.selectedGame.generationMSXId < 10000;
  }

  getGenerationMSXAddress() {
    return "http://www.generation-msx.nl/msxdb/softwareinfo/" + this.selectedGame.generationMSXId;
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

  getSelectedGameFiles(): string[] {
    var files: string[] = []

    for (let fileField of this.fileFields) {
      if (this.selectedGame[fileField] != null) {
        files.push(this.selectedGame[fileField]);
      }
    }
    return files;
  }

  setSelectedGameMedium() {
    if (this.selectedGame.romA != null) {
      this.selectedGameMedium = Promise.resolve('ROM');
    } else if (this.selectedGame.diskA != null) {
      this.selectedGameMedium = Promise.resolve('Disk');
      //TODO - get disk group
    } else if (this.selectedGame.tape != null) {
      this.selectedGameMedium = Promise.resolve('Tape');
      //TODO - get tape group
    } else if (this.selectedGame.harddisk != null) {
      this.selectedGameMedium = Promise.resolve('Harddisk');
    } else if (this.selectedGame.laserdisc != null) {
      this.selectedGameMedium = Promise.resolve('Laserdisc');
    } else {
      //shouldn't happen
      this.selectedGameMedium = Promise.resolve('')
    }
  }

  getSizeDisplayString(): string {
    return Math.floor(this.selectedGame.size / 1024) + " KB"
  }

  exploreFile(file: string) {
    this.gamesService.exploreFile(file);
  }

  isGenerationMSX(): boolean {
    return GameUtils.isMSX(this.selectedGame)
  }

  isGenerationMSX2(): boolean {
    return GameUtils.isMSX2(this.selectedGame)
  }

  isGenerationMSX2Plus(): boolean {
    return GameUtils.isMSX2Plus(this.selectedGame)
  }

  isGenerationTurboR(): boolean {
    return GameUtils.isTurboR(this.selectedGame)
  }

  getSoundsDisplayString(): string {
    let displayString: string[] = []

    if (GameUtils.isPSG(this.selectedGame)) {
      displayString.push('PSG')
    }
    if (GameUtils.isSCC(this.selectedGame)) {
      displayString.push('SCC')
    }
    if (GameUtils.isSCCI(this.selectedGame)) {
      displayString.push('SCC-I')
    }
    if (GameUtils.isPCM(this.selectedGame)) {
      displayString.push('PCM')
    }
    if (GameUtils.isMSXMusic(this.selectedGame)) {
      displayString.push('MSX-MUSIC')
    }
    if (GameUtils.isMSXAudio(this.selectedGame)) {
      displayString.push('MSX-AUDIO')
    }
    if (GameUtils.isMoonsound(this.selectedGame)) {
      displayString.push('Moonsound')
    }
    if (GameUtils.isMidi(this.selectedGame)) {
      displayString.push('MIDI')
    }

    return displayString.join(', ')
  }

  getGenresDisplayString(): string {
    let displayString: string = GameUtils.getGenre(this.selectedGame.genre1);
    if (displayString != null) {
      var genre2 = GameUtils.getGenre(this.selectedGame.genre2);
      if (genre2 != null) {
        displayString += ", " + genre2;
      }
    }
    return displayString;
  }

  private initialize() {
    this.selectedGame = null;
    this.screenshot_a_1 = this.screenshot_a_2 = this.noScreenshotImage1;
    this.screenshot_b_1 = this.screenshot_b_2 = this.noScreenshotImage2;
  }

  private setScreenshots(secondaryData: GameSecondaryData) {
    if (this.toggle) {
      this.screenshot_a_1 = this.getScreenshot1Data(secondaryData);
      this.screenshot_b_1 = this.getScreenshot2Data(secondaryData);
      this.transparent1 = ""
      this.transparent2 = "transparent"
    } else {
      this.screenshot_a_2 = this.getScreenshot1Data(secondaryData);
      this.screenshot_b_2 = this.getScreenshot2Data(secondaryData);
      this.transparent1 = "transparent"
      this.transparent2 = ""
    }
    this.toggle = !this.toggle;
  }

  private setMusicFiles(secondaryData: GameSecondaryData) {
    this.musicFiles = secondaryData.musicFiles;
    if (this.musicFiles && this.musicFiles.length > 0) {
      this.selectedMusicFile = this.musicFiles[0];
    } else {
      this.selectedMusicFile = null;
    }
  }

  setSelectedMusicFile(musicFile: string) {
    this.selectedMusicFile = musicFile;
  }

  getMusicName(musicFile: string) {
    let firstIndex = musicFile.lastIndexOf('_') + 1;
    let lastIndex = musicFile.lastIndexOf('.');
    if (firstIndex < 0 || lastIndex < 0 || lastIndex <= firstIndex) {
      return "Unknown";
    } else {
      return musicFile.substring(firstIndex, lastIndex);
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
