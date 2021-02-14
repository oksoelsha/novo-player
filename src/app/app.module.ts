import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { WindowControlsComponent } from './shared/window-controls/window-controls.component';
import { HelpComponent } from './pages/help/help.component';
import { FileSystemChooserComponent } from './shared/fs-chooser/fs-chooser.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmLeaveComponent } from './shared/confirm-leave/confirm-leave.component';
import { AlertsComponent } from './shared/alerts/alerts.component';
import { ScanParametersComponent } from './popups/scan-parameters/scan-parameters.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MediaEditComponent } from './popups/media-edit/media-edit.component';
import { DropDownComponent } from './shared/drop-down/drop-down.component';

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
    DropDownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmLeaveComponent,
  ]
})
export class AppModule { }
