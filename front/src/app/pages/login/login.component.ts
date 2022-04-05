import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from './../../services/authentication.service'
import { SnackbarServices } from './../../services/snackbar.service';
import { NgToastService } from 'ng-angular-popup';
import { StoreService } from 'src/app/store/store.service';
import { Stores } from 'src/app/models/main.enums';
import { CookieService } from 'ngx-cookie-service';
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup
	progress : boolean
    constructor(
        private fb: FormBuilder,
		private httpAuthentication: AuthenticationService,
		private _snackBar: SnackbarServices,
		private router: Router,
		private toast : NgToastService	,	
		private methodStore : StoreService,
		private cookie : CookieService
    ) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        })
    }

	ngOnInit() {

	}

   async login() {

	this.progress = true
	try{

		const checkUser:any = await this.httpAuthentication.checkuserAccount(this.loginForm.value)
		/***
		 * checkUser[1] ==token
		 */
		
		this.cookie.set("access_token", checkUser[1])
		this._snackBar._showSnack(`Success`, 'success')

		this.methodStore.addToStore(Stores.USERCODES,  {data : checkUser[0] })		

		sessionStorage.setItem('userLog', btoa(checkUser[0].id));
		sessionStorage.setItem('type', btoa(checkUser[0].user_type));
		sessionStorage.setItem('code', btoa(checkUser[0].username)); //decript atob
		
		await this.httpAuthentication.loginLogs(checkUser[0])
		.then((result:any) => {
			
			if(result.message === 'ok'){
				if (checkUser[0].user_type !== 'Teller') {
			
					this.router.navigate(['/main'])
					
				} else {
					
					this.router.navigate(['/teller']) 
				} 
			}else{
				this._snackBar._showSnack("Try Again", 'error')
			}
			
			this.progress = false
		}).catch((err) => {
			
			this.progress = false
			this._snackBar._showSnack(err, 'error')	
		})
		
		
		this.progress = false
		
	}catch(err:any){
		this.progress = false
		this._snackBar._showSnack(err.error.message, 'error')
	}

  }

}