import { Pipe, PipeTransform } from '@angular/core';
import { Game } from 'src/app/models/game';

@Pipe({
  name: 'selectedGameClass'
})
export class SelectedGameClassPipe implements PipeTransform {

  transform(game: Game, selectedGame: Game, otherSelectedGames: Set<Game>): string {
    if (game === selectedGame) {
      return 'selected-game';
    } else if (otherSelectedGames.has(game)) {
      return 'selected-secondary-game';
    } else {
      return '';
    }
  }
}
