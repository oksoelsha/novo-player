import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GamesListerService } from 'src/app/services/games-lister.service';
import { ScreenshotData } from 'src/app/models/screenshot-data';
import { ScannerService } from 'src/app/services/scanner.service';
import { GameUtils } from 'src/app/models/game-utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  @ViewChild('gameDetailSimpleText') private gameDetailSimpleText: TemplateRef<object>;
  @ViewChild('gameDetailFiles') private gameDetailFiles: TemplateRef<object>;
  @ViewChild('gameDetailSize') private gameDetailSize: TemplateRef<object>;
  @ViewChild('gameDetailGenerations') private gameDetailGenerations: TemplateRef<object>;
  @ViewChild('gameDetailSounds') private gameDetailSounds: TemplateRef<object>;
  @ViewChild('gameDetailGenres') private gameDetailGenres: TemplateRef<object>;

  static readonly noScreenshot1: ScreenshotData = new ScreenshotData("assets/noscrsht.png", "");
  static readonly noScreenshot2: ScreenshotData = new ScreenshotData("", "assets/noscrsht.png");

  games: Promise<Game[]>;
  screenshot_a_1: ScreenshotData;
  screenshot_a_2: ScreenshotData;
  screenshot_b_1: ScreenshotData;
  screenshot_b_2: ScreenshotData;
  toggle: boolean = false;
  transparent1: string = "";
  transparent2: string = "transparent";

  selectedGame: Game = null;

  private readonly gameDetails = [
    { name: "Common Name", value: "title", blockName: "gameDetailSimpleText" },
    { name: "Files", value: "sha1Code", blockName: "gameDetailFiles" },          //HACK - had to use sha1Code for the field name - CHANGE
    { name: "System", value: "system", blockName: "gameDetailSimpleText" },
    { name: "Company", value: "company", blockName: "gameDetailSimpleText" },
    { name: "Year", value: "year", blockName: "gameDetailSimpleText" },
    { name: "Country", value: "country", blockName: "gameDetailSimpleText" },
    { name: "SHA1", value: "sha1Code", blockName: "gameDetailSimpleText" },
    { name: "Size", value: "size", blockName: "gameDetailSize" },
    { name: "Generations", value: "generations", blockName: "gameDetailGenerations" },
    { name: "Sound", value: "sounds", blockName: "gameDetailSounds" },
    { name: "Genres", value: "genre1", blockName: "gameDetailGenres" },
    { name: "Mapper", value: "mapper", blockName: "gameDetailSimpleText" },
    { name: "Start", value: "start", blockName: "gameDetailSimpleText" },
    { name: "Remark", value: "remark", blockName: "gameDetailSimpleText" },
    { name: "Generation-MSX ID", value: "generationMSXId", blockName: "gameDetailSimpleText" },
  ]

  constructor(private gamesLister: GamesListerService, private scanner: ScannerService) { }

  ngOnInit() {
    this.games = this.gamesLister.getGames();
    this.screenshot_a_1 = this.screenshot_a_2 = HomeComponent.noScreenshot1;
    this.screenshot_b_1 = this.screenshot_b_2 = HomeComponent.noScreenshot2;
  }

  getFilteredGameDetails() {
    return this.gameDetails.filter(d => this.selectedGame[d.value] != null)
  }

  launch(game: Game) {
    this.gamesLister.launchGame(game);
  }

  showInfo(game: Game) {
    this.selectedGame = game;
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

  getGameMedium(game: Game): string {
    if (game.romA != null) {
      return "assets/icons/media/rom.png"
    } else if (game.diskA != null) {
      return "assets/icons/media/disk.png"
    } else if (game.tape != null) {
      return "assets/icons/media/tape.png"
    } else if (game.harddisk != null) {
      return "assets/icons/media/harddisk.png"
    } else if (game.laserdisc != null) {
      return "assets/icons/media/laserdisc.png"
    }
  }

  scanForGames() {
    this.startScan([
//      'C:\\Games\\MSX System\\Software\\Programs',
      'C:\\Games\\MSX System\\Software\\roms',
      'C:\\Games\\MSX System\\Software\\DSK',
      'C:\\Games\\MSX various game files\\cas',
//      'C:\\Games\\MSX-Laserdisc\\Astron Belt',
    ])
  }

  startScan(folders: string[]) {
    this.scanner.scan(folders).then(result => {
      this.games = Promise.resolve(result)
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
    var fileFields: string[] = ['romA', 'romB', 'diskA', 'diskB', 'tape', 'harddisk', 'laserdisc']
    var files: string[] = []

    for(let fileField of fileFields) {
      if (this.selectedGame[fileField] != null) {
        files.push(this.selectedGame[fileField]);
      }
    }
    return files;
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
    let displayString: string = "";

    if (GameUtils.isPSG(this.selectedGame)) {
      displayString += "PSG, "
    }
    if (GameUtils.isSCC(this.selectedGame)) {
      displayString += "SCC, "
    }
    if (GameUtils.isSCCI(this.selectedGame)) {
      displayString += "SCC-I, "
    }
    if (GameUtils.isPCM(this.selectedGame)) {
      displayString += "PCM, "
    }
    if (GameUtils.isMSXMusic(this.selectedGame)) {
      displayString += "MSX-MUSIC, "
    }
    if (GameUtils.isMSXAudio(this.selectedGame)) {
      displayString += "MUSIC-AUDIO, "
    }
    if (GameUtils.isMoonsound(this.selectedGame)) {
      displayString += "Moonsound, "
    }
    if (GameUtils.isMidi(this.selectedGame)) {
      displayString += "MIDI"
    }

    if (displayString.endsWith(", ")) {
      displayString = displayString.substr(0, displayString.length - 2);
    }

    return displayString;
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

  private getScreenshot1Data(screenshots: ScreenshotData): ScreenshotData {
    if (screenshots.screenshot1 == "") {
      return HomeComponent.noScreenshot1;
    } else {
      return screenshots;
    }
  }

  private getScreenshot2Data(screenshots: ScreenshotData): ScreenshotData {
    if (screenshots.screenshot2 == "") {
      return HomeComponent.noScreenshot2;
    } else {
      return screenshots;
    }
  }
}
