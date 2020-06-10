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

  games: Promise<Game[]>;
  screenshot_a_1: Promise<ScreenshotData>;
  screenshot_a_2: Promise<ScreenshotData>;
  screenshot_b_1: Promise<ScreenshotData>;
  screenshot_b_2: Promise<ScreenshotData>;
  toggle: boolean = false;
  transparent1: string = "";
  transparent2: string = "transparent";

  constructor(private gamesLister: GamesListerService) { }

  ngOnInit() {
    this.games = this.gamesLister.getGames();
    this.screenshot_a_1 = new Promise((resolve) => {
      resolve(new ScreenshotData("assets/noscrsht.png", ""));
    });
    this.screenshot_b_1 = new Promise((resolve) => {
      resolve(new ScreenshotData("", "assets/noscrsht.png"));
    });
  }

  launch(game: Game) {
    this.gamesLister.launchGame(game);
  }

  showInfo(game: Game) {
    let screenshots: Promise<ScreenshotData> = this.gamesLister.getScreenshot(game)
    if(this.toggle) {
      this.screenshot_a_1 = screenshots;
      this.screenshot_b_1 = screenshots;
      this.transparent1 = ""
      this.transparent2 = "transparent"
    } else {
      this.screenshot_a_2 = screenshots;
      this.screenshot_b_2 = screenshots;
      this.transparent1 = "transparent"
      this.transparent2 = ""
    }
    this.toggle = !this.toggle;
  }
}
