import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { EmulatorService } from 'src/app/services/emulator.service';

@Component({
  selector: 'app-media-edit',
  templateUrl: './media-edit.component.html',
  styleUrls: ['./media-edit.component.sass']
})
export class MediaEditComponent implements OnInit {

  @Input ('game') game: Game;
  @Output() updatedGame: EventEmitter<Game> = new EventEmitter<Game>();

  private topNode: HTMLElement;

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

  constructor(private emulatorService: EmulatorService) {}

  ngOnInit(): void {
    let self = this;
    this.topNode = document.getElementById('media-edit-component');

    window.addEventListener('click', function (e: any) {
      if (e.target == self.topNode) {
        self.close();
      }
    });
  }

  open(): void {
    //intercept key board events to prevent them from propagating to the parent window
    document.addEventListener('keyup', this.handleKeyEvents);
    this.topNode.classList.add('media-edit-fade');

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
    document.removeEventListener('keyup', this.handleKeyEvents);
    this.topNode.classList.remove('media-edit-fade');
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

  private handleKeyEvents(event: any): void {
    event.stopPropagation();
  }
}
