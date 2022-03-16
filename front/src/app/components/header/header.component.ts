import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service'

import { SnackbarServices } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	@Input() isMenuOpened: boolean | undefined;
	@Output() isShowSidebar = new EventEmitter<boolean>();

	fullname :any 
	
	constructor(
		private router: Router,
		private http_auth : AuthenticationService,
		private _snackBar : SnackbarServices){ 
		
	}

	async ngOnInit(){

		if(atob(sessionStorage.getItem('type')) == 'Admin'){
			this.fullname = 'Admin'
		}else{
			const type :any = atob(sessionStorage.getItem('type'))
			const type_code : any = atob(sessionStorage.getItem('code'))
			
			await this.http_auth.getUser({type: type, type_code: type_code})

			.then((data:any)=>{

				(type === 'Branch Head')?  this.fullname = `${data[0].ownerFirstname} ${data[0].ownerLastname}` : this.fullname = `${data[0].firstname} ${data[0].lastname}`
				
				sessionStorage.setItem('d', btoa(JSON.stringify(data)))
			
			}).catch(err=>{
				
				this._snackBar._showSnack(err, 'error')
				
			})

			// console.log(data);
			
		}
	}

	public openMenu(): void {
		this.isMenuOpened = !this.isMenuOpened;

		this.isShowSidebar.emit(this.isMenuOpened);
	}

}
