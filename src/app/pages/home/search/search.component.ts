import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Game } from 'src/app/models/game';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'home-game-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent {

  @Input() parentMenuOpen: boolean = false;
  @Output() selectedGame: EventEmitter<Game> = new EventEmitter<Game>();
  @ViewChild('inputField') private inputField: ElementRef;
  @ViewChild('searchDropdown', { static: true }) private foundGamesDropdown: NgbDropdown;
  @ViewChildren("foundSearchItem") private foundSearchItems: QueryList<ElementRef>;

  searchText:string = "";
  foundGames: Game[] = [];

  constructor(private gamesService: GamesService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['parentMenuOpen'].currentValue == true) {
      setTimeout(() => {
        this.inputField.nativeElement.value = "";
        this.inputField.nativeElement.focus();
      },0);
    }
  }

  onSearchGames(text: string) {
    let trimmedText: string = text.trim();
    if (trimmedText) {
      this.gamesService.getSearch(text).then((data: Game[]) => {
        if (data.length > 0) {
          this.foundGames = data;
          this.foundGamesDropdown.open();
        } else {
          this.foundGamesDropdown.close();
        }
      });
    } else {
      this.foundGamesDropdown.close();
      this.foundGames = [];
    }
  }

  processArrowKey(event:KeyboardEvent) {
    if (this.foundGames.length > 0 && event.key == 'ArrowDown') {
      this.foundSearchItems.toArray()[0].nativeElement.focus();
    }
  }

  onSelectGame(event: Event, game: Game) {
    this.searchText = "";
    this.foundGames = [];
    this.selectedGame.emit(game);
  }
}