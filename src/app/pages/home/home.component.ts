import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GamesListerService } from 'src/app/services/games-lister.service';
import { ScreenshotData } from 'src/app/models/screenshot-data';
import { ScannerService } from 'src/app/services/scanner.service';
import { GameUtils } from 'src/app/models/game-utils';
import { Remote } from 'electron';
import { AlertsService } from 'src/app/shared/alerts/alerts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  @ViewChild('gameDetailSimpleText') private gameDetailSimpleText: TemplateRef<object>;
  @ViewChild('gameDetailFiles') private gameDetailFiles: TemplateRef<object>;
  @ViewChild('gameDetailMedium') private gameDetailMedium: TemplateRef<object>;
  @ViewChild('gameDetailSize') private gameDetailSize: TemplateRef<object>;
  @ViewChild('gameDetailCountry') private gameDetailCountry: TemplateRef<object>;
  @ViewChild('gameDetailGenerations') private gameDetailGenerations: TemplateRef<object>;
  @ViewChild('gameDetailSounds') private gameDetailSounds: TemplateRef<object>;
  @ViewChild('gameDetailGenres') private gameDetailGenres: TemplateRef<object>;
  @ViewChild('gameDetailGenerationMSXLink') private gameDetailGenerationMSXLink: TemplateRef<object>;

  private remote: Remote = (<any>window).require('electron').remote;

  private readonly noScreenshot1: ScreenshotData = new ScreenshotData("assets/noscrsht.png", "");
  private readonly noScreenshot2: ScreenshotData = new ScreenshotData("", "assets/noscrsht.png");
  private readonly fileFields: string[] = ['romA', 'romB', 'diskA', 'diskB', 'tape', 'harddisk', 'laserdisc'];

  games: Game[] = [];
  screenshot_a_1: ScreenshotData;
  screenshot_a_2: ScreenshotData;
  screenshot_b_1: ScreenshotData;
  screenshot_b_2: ScreenshotData;
  toggle: boolean = false;
  transparent1: string = "";
  transparent2: string = "transparent";

  selectedGame: Game = null;
  selectedGameMedium: Promise<string>;
  lastRemovedGame: Game = null;

  private gamesTable: Element;

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
    { name: "Generation-MSX ID", value: "generationMSXId", blockName: "gameDetailGenerationMSXLink" },
  ]

  private readonly countryFlags: Map<string,string>  = new Map([
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

  constructor(private gamesLister: GamesListerService, private scanner: ScannerService, private alertService: AlertsService) { }

  private gameQuickSearch: string = ""
  private quickTypeTimer: NodeJS.Timer = null;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key.length == 1 &&
      ((event.key >= 'a' && event.key <= 'z') || (event.key >= '0' && event.key <= '9') || (event.key >= 'A' && event.key <= 'Z'))) {
        if (this.quickTypeTimer != null) {
          clearTimeout(this.quickTypeTimer);
        }
        this.gameQuickSearch += event.key;
        this.quickTypeTimer = setTimeout(() => {
          this.jumpToNearestGame(this.gameQuickSearch);
          this.gameQuickSearch = "";
        }, 300)
    }
    else if (this.selectedGame != null) {
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
      } else if (event.key == 'Enter') {
        this.launch(this.selectedGame);
      }
    } else if (this.selectedGame == null && event.key == 'ArrowDown' && this.games.length > 0) {
      this.selectedGame = this.games[0];
      this.showInfo(this.games[0]);
    }
  }

  ngOnInit() {
    this.gamesTable = document.getElementById("games-table-data");

    if(sessionStorage.getItem('lastRemovedGame') != null) {
      this.lastRemovedGame = JSON.parse(sessionStorage.getItem('lastRemovedGame'));
    }

    this.gamesLister.getGames().then((data:Game[]) => this.games = data);
    this.screenshot_a_1 = this.screenshot_a_2 = this.noScreenshot1;
    this.screenshot_b_1 = this.screenshot_b_2 = this.noScreenshot2;
  }

  getFilteredGameDetails() {
    return this.gameDetails.filter(d => d.value == null ||
      (this.selectedGame[d.value] != null && this.selectedGame[d.value] != 0))
  }

  launch(game: Game) {
    this.gamesLister.launchGame(game);
  }

  remove(game: Game) {
    this.gamesLister.removeGame(game).then((removed: boolean) => {
      if (removed) {
        this.alertService.success("Game was removed");
        this.lastRemovedGame = game;
        sessionStorage.setItem('lastRemovedGame', JSON.stringify(game));
        this.games.splice(this.games.indexOf(game), 1);
      } else {
        this.alertService.failure("Game was not removed!");
      }
    })
  }

  undoRemove() {
    if (this.lastRemovedGame != null) {
      this.gamesLister.saveGame(this.lastRemovedGame).then((added: boolean) => {
        if (added) {
          this.alertService.success("Game was added back");
          this.addGameToSortedList(this.lastRemovedGame);
          this.lastRemovedGame = null;
        } else {
          this.alertService.failure("Game was not added back!");
        }
      });
    }
  }

  showInfo(game: Game) {
    this.selectedGame = game;
    this.setSelectedGameMedium();
    this.adjustScrollForSelectedGame(game);

    this.gamesLister.getScreenshot(game).then((screenshots) => {
      if (this.toggle) {
        this.screenshot_a_1 = this.getScreenshot1Data(screenshots);
        this.screenshot_b_1 = this.getScreenshot2Data(screenshots);
        this.transparent1 = ""
        this.transparent2 = "transparent"
      } else {
        this.screenshot_a_2 = this.getScreenshot1Data(screenshots);
        this.screenshot_b_2 = this.getScreenshot2Data(screenshots);
        this.transparent1 = "transparent"
        this.transparent2 = ""
      }
      this.toggle = !this.toggle;
    })
  }

  openGenerationMSXInBrowser(generationMSXId: number) {
    this.remote.shell.openExternal("http://www.generation-msx.nl/msxdb/softwareinfo/" + generationMSXId);
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

  scanForGames() {
    this.startScan([
      'C:\\Games\\MSX System\\Software\\roms',
      'C:\\Games\\MSX System\\Software\\OS',
      'C:\\Games\\MSX System\\Software\\DSK',
      'C:\\Games\\MSX various game files\\cas',
//      'C:\\Games\\MSX-Laserdisc\\Astron Belt',
    ])
  }

  startScan(folders: string[]) {
    this.alertService.info("Started scanning process...")
    this.scanner.scan(folders).then(result => {
      this.alertService.info("Total games added = " + result)
      this.gamesLister.getGames().then((data:Game[]) => this.games = data);
    });
  }

  selectedGameClass(game: Game): string {
    if(this.selectedGame != null && game.sha1Code == this.selectedGame.sha1Code) {
      return "selected-game";
    } else {
      return "";
    }
  }

  getSelectedGameFiles(): string[] {
    var files: string[] = []

    for(let fileField of this.fileFields) {
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

  private getScreenshot1Data(screenshots: ScreenshotData): ScreenshotData {
    if (screenshots.screenshot1 == "") {
      return this.noScreenshot1;
    } else {
      return screenshots;
    }
  }

  private getScreenshot2Data(screenshots: ScreenshotData): ScreenshotData {
    if (screenshots.screenshot2 == "") {
      return this.noScreenshot2;
    } else {
      return screenshots;
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

  private jumpToNearestGame(charachters: string) {
    let index: number;
    for (index = 0; index < this.games.length && !this.games[index].name.toLowerCase().startsWith(charachters.toLowerCase()); index++);
    if (index < this.games.length) {
      this.showInfo(this.games[index]);
    }
  }
}
