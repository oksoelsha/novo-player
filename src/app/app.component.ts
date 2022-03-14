import { Component } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { LocalizationService } from './internationalization/localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Novo Player';
  links: Link[];
  selectedIndex = 0;
  oldSelectedIndex = 0;
  private languageSetSubscription: Subscription;

  constructor(private router: Router, private localizationService: LocalizationService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationCancel) {
        // The navigation away from a form with unsaved data was canceled
        // therefore restore the old index so that the navigation bar selection
        // goes back to where it was, which is the current form page
        this.selectedIndex = this.oldSelectedIndex;
      } else if (val instanceof NavigationEnd && val.url.startsWith('/wmsx;')) {
        // When when detect navigation to WebMSX page, reset all selected navigation icons
        this.selectedIndex = -1;
        this.oldSelectedIndex = 0;
      }
    });
    this.languageSetSubscription = this.localizationService.getLanguageSetEvent().subscribe(() => {
      this.links = [
        new Link('/', 'assets/images/navigation/ic_home_white_24dp.png', localizationService.translate('navigation.main')),
        new Link('/dashboard', 'assets/images/navigation/ic_dashboard_white_24dp.png', localizationService.translate('navigation.dashboard')),
        new Link('/settings', 'assets/images/navigation/ic_settings_applications_white_24dp.png', localizationService.translate('navigation.settings'), true),
        new Link('/help', 'assets/images/navigation/ic_help_white_24dp.png', localizationService.translate('navigation.about')),
      ];
    });
  }

  setSelection(index: number) {
    this.oldSelectedIndex = this.selectedIndex;
    this.selectedIndex = index;
  }
}

class Link {
  route: string;
  image: string;
  tooltip: string;
  splitTopFromBottom: boolean;

  constructor(route: string, image: string, tooltip: string, splitTopFromBottom: boolean = false) {
    this.route = route;
    this.image = image;
    this.tooltip = tooltip;
    this.splitTopFromBottom = splitTopFromBottom;
  }
}
