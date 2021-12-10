import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/models/game';
import { Settings } from 'src/app/models/settings';
import { EmulatorService } from 'src/app/services/emulator.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-web-msx',
  templateUrl: './web-msx.component.html',
  styleUrls: ['./web-msx.component.sass']
})
export class WebMSXComponent implements OnInit, OnDestroy {

  private wmsxScript: any;
  selectedGame: Game;
  error: boolean;

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private settingsService: SettingsService,
    private emulatorService: EmulatorService) {
    this.selectedGame = JSON.parse(route.snapshot.paramMap.get('gameParams'));
  }

  ngOnInit(): void {
    this.settingsService.getSettings().then((settings: Settings) => {
      this.emulatorService.getWebMSXPath(settings.webmsxPath, 'wmsx.js').then((fullpath: string) => {
        this.error = (fullpath == null);
        if (!this.error) {
          this.loadWebMSX(fullpath);
          this.startWebmsx();
        }
      });
    });
  }

  loadWebMSX(fullpath: string) {
    this.wmsxScript = this.renderer.createElement('script');
    this.wmsxScript.src = fullpath;
    this.renderer.appendChild(document.body, this.wmsxScript);
  }

  startWebmsx() {
    const doneLoadingWMSXCheckInterval = setInterval(() => {
      if (typeof window['WMSX'] !== 'undefined' && typeof window['WMSX']['start'] !== 'undefined') {
        clearInterval(doneLoadingWMSXCheckInterval);
        window['WMSX']['start']();
      }
    }, 20);
  }

  ngOnDestroy(): void {
    if (!this.error) {
      window['WMSX']['shutdown']();
      this.renderer.removeChild(document.body, this.wmsxScript);
    }
  }
}
