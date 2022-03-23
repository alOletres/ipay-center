import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store'
/**Storage */
import { UserCodeState } from './reducer/user.reducer';
// import { UserDetailsState } from './reducer/userdetails.reducer';
/**events */
import { AddUser, AddUserDetails } from './actions/action.actions';
import { Stores } from '../models/main.enums';
/**nag buhat ta og services for global storing  */
@Injectable({
  providedIn: 'root'
})
export class StoreService {

 	constructor( private STORE_USERCODES : Store<UserCodeState>,
				//  private STORE_USERDETAILS : Store<UserDetailsState>
				  ) { }

	addToStore(storeName:any, data:any){
		console.log(storeName);
		
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
}


