import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { catchError } from 'rxjs/operators';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { MultisysService } from '../../multisys.service';
import SocketService from 'src/app/services/socket.service';
import { of } from 'rxjs';
@Component({
	selector: 'app-multysiscomp',
	templateUrl: './multysiscomp.component.html',
	styleUrls: ['./multysiscomp.component.css']
})
export class MultysiscompComponent implements OnInit {

	billingForm: FormGroup;
	

	constructor(
		private $dialogRef: MatDialogRef<MultysiscompComponent>,
		private $formGroup: FormBuilder,
		private http_multisys : MultisysService,
		private _snackBar : SnackbarServices,
		private socketService :SocketService
	) {
		this.billingForm = this.$formGroup.group({
			CostumersName: ['', Validators.required],
			contactNo: [''],
			account_number: ['', Validators.required],
			Amount: ['', Validators.required],

		})
	}

	ngOnInit(): void {

	}

	closeDialog() {
		this.$dialogRef.close()
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
	

	async inquire(){
		
		this.http_multisys.mutisysInquire(this.billingForm.value)
		.pipe(
			catchError((error:any)=>{
				this._snackBar._showSnack(error, 'error')
				return of([])
			})
		).subscribe((data:any)=>{
			console.log(data);
			
			this.socketService.sendEvent("eventSent", {data: "decreased_wallet"})/**SOCKET SEND EVENT */

		})
	}
	

}
