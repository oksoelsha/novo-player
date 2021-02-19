import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from 'src/app/models/game';
import { EmulatorService } from 'src/app/services/emulator.service';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-hardware-edit',
  templateUrl: './hardware-edit.component.html',
  styleUrls: ['./hardware-edit.component.sass']
})
export class HardwareEditComponent extends PopupComponent {

  @Input () popupId: string;
  @Input ('game') game: Game;
  @Output() updatedGame: EventEmitter<Game> = new EventEmitter<Game>();

  machines: string[] = [];
  selectedMachine: string = "";
  connectGFX9000: boolean = false;

  constructor(private emulatorService: EmulatorService) { 
    super();
  }

  open(): void {
    super.open();

    this.emulatorService.getMachines().then((data: string[]) => {
      this.machines = data;
      this.selectedMachine = this.game.machine;
    });

    this.connectGFX9000 = this.game.connectGFX9000;
  }

  close(): void {
    super.close();
  }

  save() {
    let updatedGame: Game = Object.assign({}, this.game);

    updatedGame.machine = this.selectedMachine;
    updatedGame.connectGFX9000 = this.connectGFX9000;

    this.updatedGame.emit(updatedGame);
    this.close();
  }
}