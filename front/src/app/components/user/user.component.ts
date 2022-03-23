import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { AuthenticationService } from './../../services/authentication.service'
/**STATE MANAGEMENT */
import { Store } from '@ngrx/store';
import { UserCodeState } from 'src/app/store/reducer/user.reducer';
// import { UserDetailsState } from 'src/app/store/reducer/userdetails.reducer';
import { RemoveUser, RemoveUserDetails } from 'src/app/store/actions/action.actions';
@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	fullname:any
	constructor(private router: Router,
				private http_auth: AuthenticationService,
				private _snackBar : SnackbarServices,
				private UserStore : Store<UserCodeState>,
				// private UserDetailsStore: Store<UserDetailsState> 
				) { }

	async ngOnInit(){
		if(atob(sessionStorage.getItem('type')) == 'Admin'){
			this.fullname = 'Admin'
		}else{
			const type :any = atob(sessionStorage.getItem('type'))
			const type_code : any = atob(sessionStorage.getItem('code'))
			const data: any = await this.http_auth.getUser({type: type, type_code: type_code});
			(type === 'Branch Head')?  this.fullname = `${data[0].ownerFirstname} ${data[0].ownerLastname}` : this.fullname = `${data[0].firstname} ${data[0].lastname}`
		}
	}

	async signOutEmit(){
		/**
		* offline
		*/


		await this.http_auth.signOut({
			type : atob(sessionStorage.getItem('type')),
			code : atob(sessionStorage.getItem('code'))
		}).then((response : any)=>{

			this.UserStore.dispatch(new RemoveUser())
			// this.UserDetailsStore.dispatch(new RemoveUserDetails())			
			if(response.message === 'ok'){
				window.sessionStorage.clear();
				this.router.navigate(['/login']);
			}else{
				this._snackBar._showSnack('Try Again', 'error')
			}			
		}).catch(err=>{
			this._snackBar._showSnack(err, 'error')
		})

		

	}
}
