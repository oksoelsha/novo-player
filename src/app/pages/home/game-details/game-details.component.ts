import { Component, Input, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Game } from 'src/app/models/game';
import { GameUtils } from 'src/app/models/game-utils';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-home-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.sass']
})
export class GameDetailsComponent {

  @Input() selectedGame: Game;
  @ViewChild('gameDetailSimpleText', { static: true }) private gameDetailSimpleText: TemplateRef<object>;
  @ViewChild('gameDetailFiles', { static: true }) private gameDetailFiles: TemplateRef<object>;
  @ViewChild('gameDetailMedium', { static: true }) private gameDetailMedium: TemplateRef<object>;
  @ViewChild('gameDetailSize', { static: true }) private gameDetailSize: TemplateRef<object>;
  @ViewChild('gameDetailCountry', { static: true }) private gameDetailCountry: TemplateRef<object>;
  @ViewChild('gameDetailGenerations', { static: true }) private gameDetailGenerations: TemplateRef<object>;
  @ViewChild('gameDetailSounds', { static: true }) private gameDetailSounds: TemplateRef<object>;
  @ViewChild('gameDetailGenres', { static: true }) private gameDetailGenres: TemplateRef<object>;
  @ViewChild('gameDetailGenerationMSXLink', { static: true }) private gameDetailGenerationMSXLink: TemplateRef<object>;

  private readonly gameDetails = [
    { name: 'Common Name', value: 'title', blockName: 'gameDetailSimpleText' },
    { name: 'Files', blockName: 'gameDetailFiles' },
    { name: 'Medium', blockName: 'gameDetailMedium' },
    { name: 'System', value: 'system', blockName: 'gameDetailSimpleText' },
    { name: 'Company', value: 'company', blockName: 'gameDetailSimpleText' },
    { name: 'Year', value: 'year', blockName: 'gameDetailSimpleText' },
    { name: 'Country', value: 'country', blockName: 'gameDetailCountry' },
    { name: 'SHA1', value: 'sha1Code', blockName: 'gameDetailSimpleText' },
    { name: 'Size', value: 'size', blockName: 'gameDetailSize' },
    { name: 'Generations', value: 'generations', blockName: 'gameDetailGenerations' },
    { name: 'Sound', value: 'sounds', blockName: 'gameDetailSounds' },
    { name: 'Genres', value: 'genre1', blockName: 'gameDetailGenres' },
    { name: 'Dump', value: 'dump', blockName: 'gameDetailSimpleText' },
    { name: 'Mapper', value: 'mapper', blockName: 'gameDetailSimpleText' },
    { name: 'Start', value: 'start', blockName: 'gameDetailSimpleText' },
    { name: 'Remark', value: 'remark', blockName: 'gameDetailSimpleText' },
    { name: 'Generation-MSX', value: 'generationMSXId', blockName: 'gameDetailGenerationMSXLink' },
  ];
  private readonly fileFields: string[] = ['romA', 'romB', 'diskA', 'diskB', 'tape', 'harddisk', 'laserdisc'];
  private readonly countryFlags: Map<string, string> = new Map([
    ['BR', 'pt_BR'],
    ['DE', 'de_DE'],
    ['ES', 'es_ES'],
    ['FR', 'fr_FR'],
    ['GB', 'UK'],
    ['HK', 'HK'],
    ['IT', 'it_IT'],
    ['JP', 'ja_JP'],
    ['KR', 'ko_KR'],
    ['KW', 'KW'],
    ['NL', 'nl_NL'],
    ['PT', 'PT'],
    ['RU', 'ru_RU'],
    ['SA', 'SA'],
    ['SE', 'sv_SE'],
    ['UK', 'UK'],
    ['US', 'en_US'],
    ['TW', 'zh_TW'],
    ['CA', 'CA'],
    ['EU', 'EU']
  ]);

  private selectedGameMedium: Promise<string>;

  constructor(private gamesService: GamesService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedGame'].isFirstChange() || changes['selectedGame'].currentValue.sha1Code !== changes['selectedGame'].previousValue.sha1Code) {
      this.setSelectedGameMedium();
    }
  }

  getFilteredGameDetails() {
    return this.gameDetails.filter(d => d.value == null ||
      (this.selectedGame[d.value] != null && this.selectedGame[d.value] !== 0));
  }

  getSelectedGameFiles(): string[] {
    const files: string[] = [];
    for (const fileField of this.fileFields) {
      if (this.selectedGame[fileField] != null) {
        files.push(this.selectedGame[fileField]);
      }
    }
    return files;
  }

  exploreFile(file: string) {
    this.gamesService.exploreFile(file);
  }

  getSizeDisplayString(): string {
    return Math.floor(this.selectedGame.size / 1024) + ' KB';
  }

  isGenerationMSX(): boolean {
    return GameUtils.isMSX(this.selectedGame);
  }

  isGenerationMSX2(): boolean {
    return GameUtils.isMSX2(this.selectedGame);
  }

  isGenerationMSX2Plus(): boolean {
    return GameUtils.isMSX2Plus(this.selectedGame);
  }

  isGenerationTurboR(): boolean {
    return GameUtils.isTurboR(this.selectedGame);
  }

  getSoundsDisplayString(): string {
    const displayString: string[] = [];

    if (GameUtils.isPSG(this.selectedGame)) {
      displayString.push('PSG');
    }
    if (GameUtils.isSCC(this.selectedGame)) {
      displayString.push('SCC');
    }
    if (GameUtils.isSCCI(this.selectedGame)) {
      displayString.push('SCC-I');
    }
    if (GameUtils.isPCM(this.selectedGame)) {
      displayString.push('PCM');
    }
    if (GameUtils.isMSXMusic(this.selectedGame)) {
      displayString.push('MSX-MUSIC');
    }
    if (GameUtils.isMSXAudio(this.selectedGame)) {
      displayString.push('MSX-AUDIO');
    }
    if (GameUtils.isMoonsound(this.selectedGame)) {
      displayString.push('Moonsound');
    }
    if (GameUtils.isMidi(this.selectedGame)) {
      displayString.push('MIDI');
    }

    return displayString.join(', ');
  }

  getGenresDisplayString(): string {
    let displayString: string = GameUtils.getGenre(this.selectedGame.genre1);
    if (displayString != null) {
      const genre2 = GameUtils.getGenre(this.selectedGame.genre2);
      if (genre2 != null) {
        displayString += ', ' + genre2;
      }
    }
    return displayString;
  }

  isDisplayGenerationMSX() {
    return this.selectedGame.generationMSXId < 10000;
  }

  getGenerationMSXAddress() {
    return 'http://www.generation-msx.nl/msxdb/softwareinfo/' + this.selectedGame.generationMSXId;
  }

  private setSelectedGameMedium() {
    if (this.selectedGame.romA != null) {
      this.selectedGameMedium = Promise.resolve('ROM');
    } else if (this.selectedGame.diskA != null) {
      this.selectedGameMedium = Promise.resolve('Disk');
      // TODO - get disk group
    } else if (this.selectedGame.tape != null) {
      this.selectedGameMedium = Promise.resolve('Tape');
      // TODO - get tape group
    } else if (this.selectedGame.harddisk != null) {
      this.selectedGameMedium = Promise.resolve('Harddisk');
    } else if (this.selectedGame.laserdisc != null) {
      this.selectedGameMedium = Promise.resolve('Laserdisc');
    } else {
      // shouldn't happen
      this.selectedGameMedium = Promise.resolve('');
    }
  }
}
