import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { GamesListerService } from 'src/app/services/games-lister.service';

@Component({
  selector: 'app-scan-parameters',
  templateUrl: './scan-parameters.component.html',
  styleUrls: ['./scan-parameters.component.sass']
})
export class ScanParametersComponent implements OnInit {

  @Output() parameters: EventEmitter<any> = new EventEmitter<any>();

  private topNode: HTMLElement;
  private directories: string[] = [];
  private machines: string[] = [];
  private selectedMachine: string = ""

  constructor(private gamesLister: GamesListerService) {}

  ngOnInit() {
    let self = this;
    this.topNode = document.getElementById('scan-parameters-component');

    window.addEventListener('click', function (e: any) {
      if (e.target == self.topNode) {
        self.close();
      }
    });

    this.gamesLister.getMachines().then((data: string[]) => { this.machines = data; this.selectedMachine = data[0] }); //Keep that for the bootstrap dropdown
  }

  open(): void {
    //intercept key board events to prevent them from propagating to the parent window
    document.addEventListener('keyup', this.handleKeyEvents);
    this.topNode.style.display = "block";
  }

  close(): void {
    this.directories = [];
    document.removeEventListener('keyup', this.handleKeyEvents);
    this.topNode.style.display = "none";
  }

  submitParameters(form: any): void {
    this.parameters.emit(new ScanParameters(this.directories, this.selectedMachine));
    this.close();
  }

  private handleKeyEvents(event: any): void {
    event.stopPropagation();
  }
}

export class ScanParameters {
  directories: string[];
  machine: string;

  constructor(directories: string[], machine:string) {
    this.directories = directories;
    this.machine = machine;
  }
}