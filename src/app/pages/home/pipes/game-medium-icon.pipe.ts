import { Pipe, PipeTransform } from '@angular/core';
import { Game } from 'src/app/models/game';

@Pipe({
  name: 'gameMediumIcon'
})
export class GameMediumIconPipe implements PipeTransform {

  transform(game: Game, ...args: any[]): string {
    if (game.romA != null) {
      return 'assets/images/media/rom.png';
    } else if (game.diskA != null) {
      return 'assets/images/media/disk.png';
    } else if (game.tape != null) {
      return 'assets/images/media/tape.png';
    } else if (game.harddisk != null) {
      return 'assets/images/media/harddisk.png';
    } else if (game.laserdisc != null) {
      return 'assets/images/media/laserdisc.png';
    }
  }
}
