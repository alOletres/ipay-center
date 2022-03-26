import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MultysiscompComponent } from "./shared/multysiscomp/multysiscomp.component";
import { MultisysService } from './multisys.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import SocketService from 'src/app/services/socket.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';
@Component({
	selector: 'app-multisys',
	templateUrl: './multisys.component.html',
	styleUrls: ['./multisys.component.scss']
})
export class MultisysComponent implements OnInit {

	billingForm: FormGroup;
	
	btnName :any = 'Inquire'
	account_number: any;
	amount: any;
	biller: any;
	hideResponse : boolean = false
	constructor(
		private $formGroup: FormBuilder,
		private http_multisys : MultisysService,
		private _snackBar : SnackbarServices,
		private socketService :SocketService,
		private dialog : MatDialog
	) {
		this.billingForm = this.$formGroup.group({
			CostumersName: ['', Validators.required],
			contactNo: ['',Validators.required],
			account_number: ['', Validators.required],
			Amount: ['', Validators.required],

		})
	}

	ngOnInit(): void {

	}
	async inquire(){
		const dialogRef = this.dialog.open(LoadingDialogComponent,{disableClose:true})

		if(this.btnName === 'Inquire'){
			this.http_multisys.mutisysInquire(this.billingForm.value)
			.pipe(
				catchError((error:any)=>{
					this._snackBar._showSnack(error, 'error')
					dialogRef.close()
					return of([])
				})
			).subscribe((data:any)=>{

				const { account_number, amount, biller } = JSON.parse(data)
				this.hideResponse = true
				this.account_number = account_number
				this.amount = amount
				this.biller = biller
				this.btnName = 'Proceed'
				
				dialogRef.close()
			})
		}else if(this.btnName === 'Proceed'){
			this.http_multisys.proceedTransaction(this.billingForm.value)

			.pipe(
				catchError((error:any)=>{
					this._snackBar._showSnack(error, 'error')
					dialogRef.close()
					return of([])
				})
			).subscribe((response:any)=>{
				this.socketService.sendEvent("eventSent", {data: "decreased_wallet"})/**SOCKET SEND EVENT */
				this._snackBar._showSnack(JSON.parse(response).reason, 'success')
				dialogRef.close()
			})
		}
	}
	validateOnlyNumbers(evt: any) {
		try{
			var theEvent = evt || window.event;
			var key = theEvent.keyCode || theEvent.which;
			key = String.fromCharCode( key );
			var regex = /[0-9]|\./;
			if( !regex.test(key) ) {
				theEvent.returnValue = false;
				if(theEvent.preventDefault) theEvent.preventDefault();
			}
		}catch(err){
			throw err

		}
	}
}
