import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from './../../services/branch.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReceivablesService } from "./../../services/receivables.service";
import { SnackbarServices } from './../../services/snackbar.service';
import moment from 'moment';
import SocketService from 'src/app/services/socket.service';
@Component({
  selector: 'app-global-dialog',
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss']
})
export class GlobalDialogComponent implements OnInit {
  	editForm : any
	id : any
	branchType : any
	item : any
	ib_id : any
	concat : any
	btnName : any
	barangayCode: any
	franchiseCode: any
	branchCode : any
	ib_franchiseCode:any
	disabled :any
	status: string
	codeforNotify:any
	wallet : any
	stat: any = ['Approved', 'Decline']

	// declaration of values
	constructor(
		private _snackBar: SnackbarServices,
		private receive : ReceivablesService,
		private httpBranch : BranchService,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<GlobalDialogComponent>,
    	@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private socketService : SocketService) { 

		
		if(data.item === 'Franchise' || data.item === 'iBaranggay'){
			// this.concat = 'Add' 
		}else if (data.item === 'Sheet'){
			this.concat = 'Approval'
		}else if(data.item === 'Teller') {
			this.concat = ''
		}
		// assign value from dialog
		this.id = data.id
		this.ib_id = data.ib_id
		this.branchType =data.fbranchType
		this.item = data.item
		this.btnName = data.btnName
		this.barangayCode = data.ibarangayCode	
		this.franchiseCode = data.fbranchCode
		this.branchCode = data.branchCode
		this.ib_franchiseCode = data.ib_fbranchCodconsole;
		this.codeforNotify = data.codeforNotify


		if(this.btnName == 'Save'){
			this.editForm = this.fb.group({
				firstname: ['', [Validators.required]],
				lastname: ['', [Validators.required]],
				contactNo: ['', [Validators.required]],
				email: ['', [Validators.required]],
				branchName : [data.franchiseName, [Validators.required]],
				locationAddress: ['', [Validators.required]]
			})
		}else if(this.btnName === 'Save_'){
			this.editForm = this.fb.group({
				firstname: ['', [Validators.required]],
				lastname: ['', [Validators.required]],
				contactNo: ['', [Validators.required]],
				email: ['', [Validators.required]],
				branchName : ['', [Validators.required]],
				locationAddress: ['', [Validators.required]]
			})
		}else if(this.btnName === 'Save ' ){
			// 
			this.editForm = this.fb.group({
				firstname: [{value: data.firstname, disabled: true}, [Validators.required]],
				lastname: [{value :data.lastname, disabled: true}, [Validators.required]],
				contactNo: [{value:data.contactNo, disabled: true}, [Validators.required]],
				email: [{value :data.email, disabled: true}, [Validators.required]],
				branchName : ['branch', [Validators.required]],
				locationAddress: [{value:data.location, disabled:true}, [Validators.required]],
				date_added: [{value: moment(data.date_added).format('MMMM Do YYYY, h:mm:ss a'), disabled:true}, [Validators.required]],
				id : data.ib_id
			})
		}else{
			this.editForm = this.fb.group({
				firstname: [data.firstname, [Validators.required]],
				lastname: [data.lastname, [Validators.required]],
				contactNo: [data.contactNo, [Validators.required]],
				email: [data.email, [Validators.required]],
				branchName : ['branch', [Validators.required]],
				locationAddress: [data.location, [Validators.required]],
				id : data.id
			})
		}
		
    }

	ngOnInit(){
		
	}
	async updateFbranch(){

		
		if(this.btnName == 'Save'){
			

			try{
				  await this.httpBranch.addTellerAdminFranchise({data: this.editForm.value, barangayCode: this.barangayCode, fbranchCode : this.franchiseCode, branchCode : this.branchCode, ib_franchiseCode : this.ib_franchiseCode})
				this._snackBar._showSnack(`Successfully Added`, 'success')
				this.dialogRef.close();
			}catch(err){
				this._snackBar._showSnack(err, 'error')
			}

		}else if(this.btnName === 'Save_') {

			await this.httpBranch.saveIbarangayForapproval({data : this.editForm.value, franchiseCode : this.franchiseCode, branchCode : this.branchCode})
		
			this.socketService.sendEvent("eventSent", {data: "response_ibarangay"})/**SOCKET SEND EVENT */
			
			this._snackBar._showSnack(`Successfully Added`, 'success')
			this.dialogRef.close();

		}else if(this.btnName === 'Save ' ){			
			if(this.status === undefined && this.wallet === undefined){

				this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')

			}else if(this.status === 'Approved' && this.wallet !== undefined ){
				
				const date :any = new Date() 
				const dateApproved : any = moment(date).format() //date approved
				await this.httpBranch.approvedIBstatus({id : this.id, code : this.codeforNotify, wallet: this.wallet, dateApproved : dateApproved});
				this._snackBar._showSnack(`Successfully Added`, 'success')
				this.dialogRef.close();

			}else if(this.status === 'Decline' && this.wallet === undefined ){

				const date :any = new Date() 
				const dateDecline : any = moment(date).format() //date decline
				await this.httpBranch.declineiBarangay({id : this.id, dateDecline : dateDecline}); // decline process status 2
				this._snackBar._showSnack(`Request Declined`, 'error')
				this.dialogRef.close();

			}else{

				this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')

			}
		}else{
			if(this.item == 'Teller'){
				await this.httpBranch.updateTeller_list(this.editForm.value)
				this._snackBar._showSnack(`Successfully Added`, 'success')
				this.dialogRef.close();
			}else{
				
				(this.item == 'Franchise')
				
				?  await this.httpBranch.updateFbranch({data: this.editForm.value}) 
				
				: await this.httpBranch.updateIbarangaylist({data: this.editForm.value, ib_id: this.ib_id})		
				this._snackBar._showSnack(`Successfully Added`, 'success')
				this.dialogRef.close();
			}
		}
		
	}
	closeDialog(){
		this.dialogRef.close();
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
