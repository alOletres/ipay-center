import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarServices } from './../../../services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './../../../services/authentication.service'

import { WalletService  } from './../../../services/wallet.service'
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
	sendLoadform: any
	result : any
	res_wallet :any
	btnName : any
  constructor( public dialogRef: MatDialogRef<DialogComponent>,
               @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
			   private fb : FormBuilder,
			   private http_auth : AuthenticationService,
			   private http_wallet : WalletService,
			   private _snackBar : SnackbarServices) {
		
		// load data constructor
		
		this.btnName = data.btnName
		if(data.btnName === 'Send ' ){
			this.sendLoadform = this.fb.group({
				ib_code : [data.ib_code, [Validators.required]],
				credit : [data.credit, [Validators.required]],
				paymentStatus: ['', [Validators.required]],
				id : data.id
			})
		}else{
			this.sendLoadform = this.fb.group({
				ib_code : ['', [Validators.required]],
				credit : ['', [Validators.required]],
				paymentStatus: ['', [Validators.required]]
			})
		}

	}

	async ngOnInit() {
		// auto load data here

		const data:any = await this.http_auth.getForFranchiseList({ fbranchCode : atob(sessionStorage.getItem('code'))})
		this.result = data;

		const resultwallet:any = await this.http_wallet.getFranchisewallet({ fbranchCode : atob(sessionStorage.getItem('code'))})
		this.res_wallet = resultwallet[0].current_wallet

		
		
	}
	closeDialog(){
		this.dialogRef.close()
	}
	async function_sendLoad(){
		
		if(this.btnName === 'Send'){
			
			const res:any = await this.http_wallet.sendLoadtable({data : this.sendLoadform.value, fbranchCode : atob(sessionStorage.getItem('code')), available_wallet : this.res_wallet})
		
			if(res === 'dli'){
				this._snackBar._showSnack('Something went wrong! Please your Available Credit load.', 'error')
			}else{
				this._snackBar._showSnack(`Branch Status Sucessfully Updated`, 'success')
				this.ngOnInit()
				this.dialogRef.close()
			}
		}else{
			
			if(this.sendLoadform.value.paymentStatus === '1'){
				this.dialogRef.close()
			}else{
			
				await this.http_wallet.updateLoadstatus(this.sendLoadform.value)
				this._snackBar._showSnack(`Load Paid`, 'success')
				this.ngOnInit()
				this.dialogRef.close()
			}
			//
		}
	}
}
