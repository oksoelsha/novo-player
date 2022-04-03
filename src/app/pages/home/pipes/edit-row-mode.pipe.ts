import { Pipe, PipeTransform } from '@angular/core';
import { Game } from 'src/app/models/game';

@Pipe({
  name: 'editRowMode'
})
export class EditRowModePipe implements PipeTransform {

  transform(game: Game, gameToRename): boolean {
    return game === gameToRename;
  }
}
