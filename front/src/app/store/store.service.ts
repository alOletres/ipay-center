import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store'
/**Storage */
import { UserCodeState } from './reducer/user.reducer';
// import { UserDetailsState } from './reducer/userdetails.reducer';
/**events */
import { AddUser, AddUserDetails } from './actions/action.actions';
import { Stores } from '../models/main.enums';
import { CookieService } from 'ngx-cookie-service';
/**nag buhat ta og services for global storing  */
@Injectable({
  providedIn: 'root'
})
export class StoreService {

 	constructor( private STORE_USERCODES : Store<UserCodeState>,
				//  private STORE_USERDETAILS : Store<UserDetailsState>
				private cookie : CookieService
				  ) { }

	addToStore(storeName:any, data:any){
		switch(storeName){
			case Stores.USERCODES:
				this.STORE_USERCODES.dispatch( new AddUser(data) )
			break

			// case Stores.USERDETAILS:
			// 	this.STORE_USERDETAILS.dispatch( new AddUserDetails(data) )
			// break
			default :
		}
	}
	setParamsWithAuth(params?: any) {
		return { params, headers: { "Authorization": `Bearer ${this.cookie.get("access_token")}` } }
	}

	setAuthorizedRequest() {
		return { headers: { "Authorization": `Bearer ${this.cookie.get("access_token")}` } }
	}
	setAuthorizedRequestWithBlob(){
		return { headers: { "Authorization": `Bearer ${this.cookie.get("access_token")}`, responseType :'blob'} }
	}
}


