import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { NgModule } from '@angular/core';
import { BrowserModule , } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from "./layouts/auth/auth.module";
import { MainModule } from "./layouts/main/main.module";
import { TellerModule } from "./layouts/teller/teller.module";
import { ChartsModule } from 'ng2-charts';
import { NgToastModule } from "ng-angular-popup";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';


const config: SocketIoConfig = {
	// url: 'http://192.168.1.53:3000',
	url: 'https://ippctransaction.com:3000',
	options: {}
}
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		AuthModule,
		MainModule,
		TellerModule,
		ChartsModule,
		SocketIoModule.forRoot(config),
		LoadingBarHttpClientModule,
		LoadingBarRouterModule,
		LoadingBarModule
		
	],
	
	providers: [
		{
			provide: LocationStrategy,
			useClass: HashLocationStrategy,
			
		}
	],
	bootstrap: [AppComponent]
	,
	exports:[
		NgToastModule
	]
})
export class AppModule { }
