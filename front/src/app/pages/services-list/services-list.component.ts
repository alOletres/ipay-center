import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SnackbarServices } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {

	constructor(private route :Router,
				private _snackBar : SnackbarServices) { }

	ngOnInit() {
	}

	router(){
		console.log(atob(sessionStorage.getItem('type')));
		
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) ==='Branch Head'){
			this.route.navigate(['/barkota'])
		}else{
			this._snackBar._showSnack('Admin Controlled', 'error')
		}
		
	}

}
