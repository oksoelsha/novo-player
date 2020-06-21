import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GamesListerService } from 'src/app/services/games-lister.service';
import { ScreenshotData } from 'src/app/models/screenshot-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  static noScreenshot1: ScreenshotData = new ScreenshotData("assets/noscrsht.png", "");
  static noScreenshot2: ScreenshotData = new ScreenshotData("", "assets/noscrsht.png");

  games: Promise<Game[]>;
  screenshot_a_1: ScreenshotData;
  screenshot_a_2: ScreenshotData;
  screenshot_b_1: ScreenshotData;
  screenshot_b_2: ScreenshotData;
  toggle: boolean = false;
  transparent1: string = "";
  transparent2: string = "transparent";

  selectedGame: Game = null;

  constructor(private gamesLister: GamesListerService) { }

  ngOnInit() {
    this.games = this.gamesLister.getGames();
    this.screenshot_a_1 = this.screenshot_a_2 = HomeComponent.noScreenshot1;
    this.screenshot_b_1 = this.screenshot_b_2 = HomeComponent.noScreenshot2;
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
