import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { AuthRoutingModule } from './auth-routing.module'; // Routing Module
import { LoginComponent } from "./../../pages/login/login.component"; // Login Component
import {MatProgressBarModule} from '@angular/material/progress-bar';
@NgModule({
	declarations: [
		LoginComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatTabsModule,
		MatButtonModule,
		MatInputModule,
		AuthRoutingModule,
		MatProgressBarModule
	]
})
export class AuthModule { }
