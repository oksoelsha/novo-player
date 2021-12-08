import { Component, Output, EventEmitter, Input } from '@angular/core';
import { EmulatorService } from 'src/app/services/emulator.service';
import { PopupComponent } from '../popup.component';

@Component({
  selector: 'app-scan-parameters',
  templateUrl: './scan-parameters.component.html',
  styleUrls: ['../../common-styles.sass', './scan-parameters.component.sass']
})
export class ScanParametersComponent extends PopupComponent {

  @Input() popupId: string;
  @Input('listings') listings: string[] = [];
  @Input('files-and-folders') items: string[] = [];
  @Input('current-listing') currentListing = '';
  @Output() parameters: EventEmitter<ScanParameters> = new EventEmitter<ScanParameters>();

  selectedListing = '';
  machines: string[] = [];
  selectedMachine = '';

  constructor(private emulatorService: EmulatorService) {
    super();
  }

  open(): void {
    super.open();

    this.emulatorService.getMachines().then((data: string[]) => {
      this.machines = data;
      if (!this.selectedMachine) {
        this.selectedMachine = data[0];
      }
    });
  }

  close(): void {
    this.items = [];

    super.close();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  submitParameters(): void {
    this.parameters.emit(new ScanParameters(this.items, this.selectedListing, this.selectedMachine));
    this.close();
  }
}

export class ScanParameters {
  items: string[];
  listing: string;
  machine: string;

  constructor(items: string[], listing: string, machine: string) {
    this.items = items;
    this.listing = listing;
    this.machine = machine;
  }
}
