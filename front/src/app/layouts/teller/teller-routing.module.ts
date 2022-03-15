import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanActivateGuard } from "./../../guards/can-activate.guard";
import { DeActivateGuard } from "./../../guards/de-activate.guard";
// component pages
import { TellermainComponent } from "./../../pages/tellermain/tellermain.component";
import { TellerservicesComponent } from './../../tellercomponents/tellerservices/tellerservices.component';
import { TellersettingsComponent } from 'src/app/tellercomponents/tellersettings/tellersettings.component';
// import { TellerpagesComponent } from './../../tellercomponents/tellerpages/tellerpages.component';

// api pages
import { BarkotaComponent } from 'src/app/api/barkota/barkota.component';
import { SettingsComponent } from './../../api/barkota/settings/settings.component';

const routes: Routes = [
  {
		path: '',
		canActivate: [CanActivateGuard],
		component: TellermainComponent,
		canDeactivate: [DeActivateGuard],
		children: [
			{
				path: '',
				redirectTo: '/tellerdashboard',
				pathMatch: 'full'
			},{
				path: 'tellerdashboard',
				component: TellerservicesComponent
			},{
				path : 'barkotadashboard',
				component : BarkotaComponent
			}, {
				path : 'barkotaSettings',
				component : SettingsComponent
			},{
				path : 'tellerSettings',
				component : TellersettingsComponent
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TellerRoutingModule { }
