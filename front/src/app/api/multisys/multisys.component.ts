import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MultysiscompComponent } from "./shared/multysiscomp/multysiscomp.component";
import { MultisysService } from './multisys.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import SocketService from 'src/app/services/socket.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
	selector: 'app-multisys',
	templateUrl: './multisys.component.html',
	styleUrls: ['./multisys.component.scss']
})
export class MultisysComponent implements OnInit {

	billingForm: FormGroup;
	
	btnName :any = 'Inquire'
	constructor(
		private $formGroup: FormBuilder,
		private http_multisys : MultisysService,
		private _snackBar : SnackbarServices,
		private socketService :SocketService
	) {
		this.billingForm = this.$formGroup.group({
			CostumersName: ['', Validators.required],
			contactNo: ['',Validators.required, Validators.maxLength(10)],
			account_number: ['', Validators.required],
			Amount: ['', Validators.required],

		})
	}

	ngOnInit(): void {

	}
	async inquire(){

		if(this.btnName === 'Inquire'){
			this.http_multisys.mutisysInquire(this.billingForm.value)
			.pipe(
				catchError((error:any)=>{
					this._snackBar._showSnack(error, 'error')
					return of([])
				})
			).subscribe((data:any)=>{
				console.log(data);
				this.btnName === 'Proceed'
				this.socketService.sendEvent("eventSent", {data: "decreased_wallet"})/**SOCKET SEND EVENT */

			})
		}else{

		}
	}
	validateOnlyNumbers(evt: any) {
		var theEvent = evt || window.event;
		var key = theEvent.keyCode || theEvent.which;
		key = String.fromCharCode( key );
		var regex = /[0-9]|\./;
		if( !regex.test(key) ) {
		  	theEvent.returnValue = false;
		  	if(theEvent.preventDefault) theEvent.preventDefault();
		}
	}
}
