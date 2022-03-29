import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MultysiscompComponent } from "./shared/multysiscomp/multysiscomp.component";
import { MultisysService } from './multisys.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import SocketService from 'src/app/services/socket.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResetformService } from 'src/app/services/resetform.service';
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
	displayedColums : any = ['no', 'customer_name', 'account_number', 'amount', 'contact_number', 'refno', 'biller', 'collections', 'sales', 'income', 'status']
	dataSource: any;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	constructor(
		private $formGroup: FormBuilder,
		private http_multisys : MultisysService,
		private _snackBar : SnackbarServices,
		private socketService :SocketService,
		private dialog : MatDialog,
		private http_teller : MultisysService,
		private resetForm : ResetformService
	) {
		this.billingForm = this.$formGroup.group({
			CostumersName: ['', Validators.required],
			contactNo: ['',Validators.required],
			account_number: ['', Validators.required],
			Amount: ['', Validators.required],

		})
	}

	ngOnInit(){
		this.multisys()
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
			this.http_multisys.proceedTransaction({
				data : this.billingForm.value,
				amount : this.amount,
				tellerCode: atob(sessionStorage.getItem('code'))
			})

			.pipe(
				catchError((error:any)=>{
					this._snackBar._showSnack(error, 'error')
					dialogRef.close()
					return of([])
				})
			).subscribe((response:any)=>{
				if(JSON.parse(response).status === 400 || JSON.parse(response).status === 401 ){
					
					this._snackBar._showSnack(`${JSON.parse(response).reason}`, 'error')

				}else if( JSON.parse(response).status === 200 ){
					this.socketService.sendEvent("eventSent", {data: "decreased_wallet"})/**SOCKET SEND EVENT */
					this._snackBar._showSnack(`${JSON.parse(response).reason}`, 'success')
					this.resetForm.reset(this.billingForm)
					this.btnName = 'Inquire'
					this.hideResponse = false
					this.ngOnInit()
				}	
				dialogRef.close()
			})
		}
	}
	async multisys(){
		try{
			const data = await this.http_teller.multisys()
			const result = Object.values(data)
			const dataHandler = result.filter((x:any)=> {
				return x.tellerCode === atob(sessionStorage.getItem('code')) && moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00" === moment(new Date()).format("YYYY-MM-DD") + "00:00:00"
			})
			this.dataSource = new MatTableDataSource<any>( dataHandler)// display for log user franchise
			this.dataSource.paginator = this.paginator
			
		}catch(err:any){
			this._snackBar._showSnack('Failed to Fetch', 'error' )
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
