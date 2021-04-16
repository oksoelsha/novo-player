import { Component, OnInit } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title: string = "Novo Player";
  links: Link[];
  selectedIndex: number = 0;
  oldSelectedIndex: number = 0;

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationCancel) {
        //The navigation away from a form with unsaved data was canceled
        //therefore restore the old index so that the navigation bar selection
        //goes back to where it was, which is the current form page
        this.selectedIndex = this.oldSelectedIndex;
      } else if (val instanceof NavigationEnd && val.url.startsWith("/wmsx;")) {
        //When when detect navigation to WebMSX page, reset all selected navigation icons
        this.selectedIndex = -1;
        this.oldSelectedIndex = 0;
      }
    });
  }

  ngOnInit() {
    this.links = [
      new Link("/", "assets/images/navigation/ic_home_white_24dp.png", "Main Screen"),
      new Link("/dashboard", "assets/images/navigation/ic_dashboard_white_24dp.png", "Dashboard"),
      new Link("/settings", "assets/images/navigation/ic_settings_applications_white_24dp.png", "Settings", true),
      new Link("/help", "assets/images/navigation/ic_help_white_24dp.png", "About"),
    ];
  }

  setSelection(index: number) {
    this.oldSelectedIndex = this.selectedIndex;
    this.selectedIndex = index;
  }
}

class Link {
  route: string;
  image: string;
  tooltip:string;
  splitTopFromBottom: boolean;

  constructor(route: string, image: string, tooltip: string, splitTopFromBottom: boolean = false) {
    this.route = route;
    this.image = image;
    this.tooltip = tooltip;
    this.splitTopFromBottom = splitTopFromBottom;
  }
}