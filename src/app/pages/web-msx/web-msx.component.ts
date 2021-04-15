import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models/game';
import { Settings } from 'src/app/models/settings';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-web-msx',
  templateUrl: './web-msx.component.html',
  styleUrls: ['./web-msx.component.sass']
})
export class WebMSXComponent implements OnInit, AfterViewInit, OnDestroy {

  private paramsSubscription: Subscription;
  private wmsxScript: any;
  selectedGame: Game;

  constructor(private renderer: Renderer2, private route: ActivatedRoute, private settingsService: SettingsService) {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.selectedGame = JSON.parse(route.snapshot.params['gameParams']);
    });
  }

  ngOnInit(): void {
    this.settingsService.getSettings().then((settings: Settings) => {
      this.wmsxScript = this.renderer.createElement('script');
      this.wmsxScript.src = this.joinPaths(settings.webmsxPath, "wmsx.js");
      this.renderer.appendChild(document.body, this.wmsxScript);
    });
  }

  ngAfterViewInit(): void {
    var doneLoadingWMSXCheckInterval = setInterval(function () {
      if (typeof window["WMSX"] !== 'undefined' && typeof window["WMSX"]["start"] !== 'undefined') {
        clearInterval(doneLoadingWMSXCheckInterval);
        window["WMSX"]["start"]();
      }
    }, 10);
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    window["WMSX"]["shutdown"]();
    this.renderer.removeChild(document.body, this.wmsxScript);
  }

  private joinPaths(path1:string, path2:string): string {
    if (path1.endsWith("\\")) {
      return path1 + path2;
    } else {
      return path1 + "\\" + path2;
    }
  }
}
