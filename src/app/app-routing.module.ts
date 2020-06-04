import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { HelpComponent } from "./pages/help/help.component";
import { DeactivateGuardService } from './guards/deactivate-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent, canDeactivate:[DeactivateGuardService] },
  { path: 'help', component: HelpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
