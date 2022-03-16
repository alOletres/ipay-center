import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from './../../services/authentication.service'
import { SnackbarServices } from './../../services/snackbar.service';
import { NgToastService } from 'ng-angular-popup';
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
		private toast : NgToastService
		
		
		
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
		
		this._snackBar._showSnack(`Success`, 'success')
		
		sessionStorage.setItem('userLog', btoa(checkUser.id));
		sessionStorage.setItem('type', btoa(checkUser.user_type));
		sessionStorage.setItem('code', btoa(checkUser.username)); //decript atob
		
		await this.httpAuthentication.loginLogs(checkUser)
		.then((result:any) => {
			
			if(result.message === 'ok'){
				if (checkUser.user_type !== 'Teller') {
			
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
		this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')
	}

  }

}