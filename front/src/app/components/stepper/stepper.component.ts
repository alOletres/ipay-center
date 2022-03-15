import { Component, OnInit, Inject, Optional } from '@angular/core';
import { BranchService } from './../../services/branch.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarServices } from './../../services/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import SocketService from 'src/app/services/socket.service';
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
	

	dataList : any
	franchiseData : any
	addFranchiseform: FormGroup
	firstFormGroup: FormGroup
  	secondFormGroup: FormGroup
	code : any = '3'
	stepper:any
	disable : any
	branch : any
	branchCode : any
	fbranchCode : any
	isEditable = false;
	constructor( 
		private _snackBar: SnackbarServices,
		private fb: FormBuilder, 
		private httpBranch: BranchService, 
		public dialogRef: MatDialogRef<StepperComponent>,
    	@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private socketService : SocketService) { 

		this.franchiseData = data
		this.branch = data.branch

		this.branchCode = data.branchCode
		this.fbranchCode = data.fbranchCode
		
    	this.addFranchiseform = this.fb.group({
			firstname 		: new FormControl ('', [Validators.required]),
			lastname		: new FormControl ('', [Validators.required]),
			contactNo		: new FormControl ('', [Validators.required]),
			email			: new FormControl ('', [Validators.required]),
			locationAddress : new FormControl ('', [Validators.required]),
			branchName		: new FormControl ('', [Validators.required])
    	})
		this.firstFormGroup = this.fb.group({
			firstCtrl		: new FormControl ('', [Validators.required]),
		  });
		this.secondFormGroup = this.fb.group({
			wallet			: new FormControl ('', [Validators.required])
		});
		
    }

	ngOnInit(){
		
	
  	}
   async franchiseSave(){

		try{
			(this.branch == 'Franchise')
			
			? await this.httpBranch.saveFbranch({...this.addFranchiseform.value, code: this.franchiseData.branchCode})
				.then(()=>{

					this.socketService.sendEvent("eventSent", {data: "response_addFranchise"})/**SOCKET SEND EVENT */	
					this._snackBar._showSnack(`Branch Save`, 'success')
				})
			: await this.httpBranch.saveIbarangay({...this.addFranchiseform.value, branchCode : this.branchCode, fbranchCode :this.fbranchCode})
				.then(()=>{
					this.socketService.sendEvent("eventSent", {data: "response_addiBarangay"})/**SOCKET SEND EVENT */	
					this._snackBar._showSnack(`Branch Save`, 'success')
				})

		}catch(e){
			this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')
			console.log(e);
		}
  	}
	async addWallet(){
		
		try{
			(this.branch == 'Franchise') ? await this.httpBranch.savefWallet({...this.secondFormGroup.value, branchCode : this.branchCode}) : await this.httpBranch.saveibWallet({...this.secondFormGroup.value, fbranchCode :this.fbranchCode})
			this._snackBar._showSnack(`Branch Save`, 'success')
			
		}catch(e){
			this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')
			
		}
	}
	closeDialog(){
		this.dialogRef.close();
	}
	setIntervalForbutton(){
		this.disable = localStorage.getItem('disabled')
	}
	
}
