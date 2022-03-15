import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from "./pages/login/login.component";

const routes: Routes = [
	{
		path: '',
		component: LoginComponent,
		children: [
			{
				path: '',
				redirectTo: '/login',
				pathMatch: 'full'
			}, {
				path: 'login',
				loadChildren: () => import('./layouts/auth/auth.module').then(module => module.AuthModule)
			}
		]
	}, {
		path: 'main',
		pathMatch: 'full',
		loadChildren: () => import('./layouts/main/main.module').then(module => module.MainModule)
	}, {
		path: 'teller',
		pathMatch: 'full',
		loadChildren: () => import('./layouts/teller/teller.module').then(module => module.TellerModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
