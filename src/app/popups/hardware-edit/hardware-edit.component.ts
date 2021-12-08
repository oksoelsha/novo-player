import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FDDMode } from 'src/app/models/fdd-mode';
import { Game } from 'src/app/models/game';
import { InputDevice } from 'src/app/models/input-device';
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
  selectedMachine = '';
  fddModes: string[] = [];
  selectedFDDMode = '';
  inputDevices: string[] = [];
  selectedInputDevice = '';
  connectGFX9000 = false;

  readonly infoMsg = 'Works with openMSX 0.16 or later';

  constructor(private emulatorService: EmulatorService) {
    super();
  }

  open(): void {
    super.open();

    this.emulatorService.getMachines().then((data: string[]) => {
      this.machines = data;
      this.selectedMachine = this.game.machine;
    });

    this.fddModes = FDDMode.map(f => f.label);
    if (this.game.fddMode) {
      this.selectedFDDMode = FDDMode[this.game.fddMode].label;
    } else {
      this.selectedFDDMode = FDDMode[0].label;
    }

    this.inputDevices = InputDevice.map(f => f.label);
    if (this.game.inputDevice) {
      this.selectedInputDevice = InputDevice[this.game.inputDevice].label;
    } else {
      this.selectedInputDevice = InputDevice[0].label;
    }

    if (this.game.connectGFX9000) {
      this.connectGFX9000 = this.game.connectGFX9000;
    } else {
      this.connectGFX9000 = false;
    }
  }

  close(): void {
    super.close();
  }

  save() {
    const updatedGame: Game = Object.assign({}, this.game);

    updatedGame.machine = this.selectedMachine;
    updatedGame.fddMode = FDDMode.find(i => i.label === this.selectedFDDMode).value;
    updatedGame.inputDevice = InputDevice.find(i => i.label === this.selectedInputDevice).value;
    updatedGame.connectGFX9000 = this.connectGFX9000;

    this.updatedGame.emit(updatedGame);

    this.close();
  }
}
