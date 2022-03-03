import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalizationService } from 'src/app/internationalization/localization.service';
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

  @Input() popupId: string;
  @Input() game: Game;
  @Output() updatedGame: EventEmitter<Game> = new EventEmitter<Game>();

  machines: string[] = [];
  selectedMachine = '';
  fddModes: string[] = [];
  selectedFDDMode = '';
  inputDevices: string[] = [];
  selectedInputDevice = '';
  connectGFX9000 = false;

  constructor(private emulatorService: EmulatorService, private localizationService: LocalizationService) {
    super();
  }

  open(): void {
    super.open();

    this.emulatorService.getMachines().then((data: string[]) => {
      this.machines = data;
      this.selectedMachine = this.game.machine;
    });

    this.fddModes = FDDMode.map(f => this.localizationService.translate('popups.edithardware.' + f));
    if (this.game.fddMode) {
      this.selectedFDDMode = this.localizationService.translate('popups.edithardware.' + FDDMode[this.game.fddMode]);
    } else {
      this.selectedFDDMode = this.localizationService.translate('popups.edithardware.' + FDDMode[0]);
    }

    this.inputDevices = InputDevice.map(f => this.localizationService.translate('popups.edithardware.' + f));
    if (this.game.inputDevice) {
      this.selectedInputDevice = this.localizationService.translate('popups.edithardware.' + InputDevice[this.game.inputDevice]);
    } else {
      this.selectedInputDevice = this.localizationService.translate('popups.edithardware.' + InputDevice[0]);
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
    updatedGame.fddMode = this.fddModes.indexOf(this.selectedFDDMode);
    updatedGame.inputDevice = this.inputDevices.indexOf(this.selectedInputDevice);
    updatedGame.connectGFX9000 = this.connectGFX9000;

    this.updatedGame.emit(updatedGame);

    this.close();
  }
}
