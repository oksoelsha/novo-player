import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GamesListerService } from 'src/app/services/games-lister.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  games: Promise<Game[]>;

  constructor(private gamesLister: GamesListerService) { }

  ngOnInit() {
    this.games = this.gamesLister.getGames();
  }

  launch(game: Game) {
    this.gamesLister.launchGame(game);
  }
}
