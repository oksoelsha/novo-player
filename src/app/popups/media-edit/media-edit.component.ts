import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { EmulatorService } from 'src/app/services/emulator.service';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-media-edit',
  templateUrl: './media-edit.component.html',
  styleUrls: ['./media-edit.component.sass']
})
export class MediaEditComponent extends PopupComponent {

  @Input () popupId: string;
  @Input ('game') game: Game;
  @Output() updatedGame: EventEmitter<Game> = new EventEmitter<Game>();

  romA: string;
  romB: string;
  extensionRom: string;
  diskA: string;
  diskB: string;
  tape: string;
  harddisk: string;
  laserdisc: string;

  extensions: string[] = [];
  extensionRomDisplay: string = "";

  constructor(private emulatorService: EmulatorService) {
    super();
  }

  open(): void {
    super.open();

    this.romA = this.game.romA;
    this.romB = this.game.romB;
    this.extensionRom = this.game.extensionRom;
    this.diskA = this.game.diskA;
    this.diskB = this.game.diskB;
    this.tape = this.game.tape;
    this.harddisk = this.game.harddisk;
    this.laserdisc = this.game.laserdisc;

    this.emulatorService.getExtensions().then((data: string[]) => {
      this.extensions = data;
      if (this.extensionRom) {
        this.extensionRomDisplay = this.extensionRom;
      } else {
        this.extensionRomDisplay = "Select extension";
      }
    });
  }

  resetExtensionRomSelection() {
    this.extensionRom = "";
    this.extensionRomDisplay = "Select extension";
  }

  close(): void {
    super.close();
  }

  save() {
    let updatedGame: Game = Object.assign({}, this.game);

    updatedGame.romA = this.romA;
    updatedGame.romB = this.romB;
    updatedGame.extensionRom = this.extensionRom;
    updatedGame.diskA = this.diskA;
    updatedGame.diskB = this.diskB;
    updatedGame.tape = this.tape;
    updatedGame.harddisk = this.harddisk;
    updatedGame.laserdisc = this.laserdisc;

    this.updatedGame.emit(updatedGame);
    this.close();
  }
}