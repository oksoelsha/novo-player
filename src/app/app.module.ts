import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgToggleModule } from '@nth-cloud/ng-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InternationalizationModule } from './internationalization/internationalization.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InsightsComponent } from './pages/dashboard/insights/insights.component';
import { LaunchActivityComponent } from './pages/dashboard/launch-activity/launch-activity.component';
import { LaunchEventsComponent } from './pages/dashboard/launch-events/launch-events.component';
import { MediaCardComponent } from './pages/dashboard/media-card/media-card.component';
import { TotalsCardComponent } from './pages/dashboard/totals-card/totals-card.component';
import { HelpComponent } from './pages/help/help.component';
import { GameDetailsComponent } from './pages/home/game-details/game-details.component';
import { HomeComponent } from './pages/home/home.component';
import { MusicComponent } from './pages/home/music/music.component';
import { SearchComponent } from './pages/home/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { WebMSXComponent } from './pages/web-msx/web-msx.component';
import { ChangeListingComponent } from './popups/change-listing/change-listing.component';
import { HardwareEditComponent } from './popups/hardware-edit/hardware-edit.component';
import { ManageListingsComponent } from './popups/manage-listings/manage-listings.component';
import { MediaEditComponent } from './popups/media-edit/media-edit.component';
import { PopupComponent } from './popups/popup.component';
import { ScanParametersComponent } from './popups/scan-parameters/scan-parameters.component';
import { AlertsComponent } from './shared/alerts/alerts.component';
import { ConfirmLeaveComponent } from './shared/confirm-leave/confirm-leave.component';
import { DropDownWithInputComponent } from './shared/drop-down-with-input/drop-down-with-input.component';
import { DropDownComponent } from './shared/drop-down/drop-down.component';
import { ElapsedTimeComponent } from './shared/elapsed-time/elapsed-time.component';
import { FileSystemChooserComponent } from './shared/fs-chooser/fs-chooser.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { WebLinkComponent } from './shared/web-link/web-link.component';
import { WindowControlsComponent } from './shared/window-controls/window-controls.component';
import { GameMediumIconPipe } from './pages/home/pipes/game-medium-icon.pipe';
import { SelectedGameClassPipe } from './pages/home/pipes/selected-game-class.pipe';
import { EditRowModePipe } from './pages/home/pipes/edit-row-mode.pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SettingsComponent,
    WindowControlsComponent,
    HelpComponent,
    FileSystemChooserComponent,
    ConfirmLeaveComponent,
    AlertsComponent,
    ScanParametersComponent,
    DashboardComponent,
    MediaEditComponent,
    DropDownComponent,
    PopupComponent,
    HardwareEditComponent,
    ElapsedTimeComponent,
    TotalsCardComponent,
    MediaCardComponent,
    LaunchActivityComponent,
    ChangeListingComponent,
    DropDownWithInputComponent,
    SearchComponent,
    WebLinkComponent,
    WebMSXComponent,
    MusicComponent,
    GameDetailsComponent,
    ManageListingsComponent,
    LaunchEventsComponent,
    PaginationComponent,
    InsightsComponent,
    GameMediumIconPipe,
    SelectedGameClassPipe,
    EditRowModePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    NgToggleModule,
    NgbModule,
    NgApexchartsModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    HttpClientModule,
    InternationalizationModule.forRoot({ locale_id: 'en-US' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmLeaveComponent,
  ]
})
export class AppModule { }
