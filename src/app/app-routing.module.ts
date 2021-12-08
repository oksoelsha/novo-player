import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { HelpComponent } from './pages/help/help.component';
import { DeactivateGuardService } from './guards/deactivate-guard.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WebMSXComponent } from './pages/web-msx/web-msx.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent, canDeactivate:[DeactivateGuardService] },
  { path: 'help', component: HelpComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'wmsx', component: WebMSXComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
