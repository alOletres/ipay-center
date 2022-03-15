import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BranchService } from "./../../../services/branch.service";
import { SnackbarServices } from './../../../services/snackbar.service';
import { ResetformService } from "./../../../services/resetform.service";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import SocketService from 'src/app/services/socket.service';

@Component({
	selector: 'app-addbranch',
	templateUrl: './addbranch.component.html',
	styleUrls: ['./addbranch.component.scss']
})

export class AddbranchComponent implements OnInit {
	

	addbranchform: FormGroup
	btnName: string = 'Save'
	forUpdating: any
	receivedRow: any 
	progress : boolean = false
		constructor(
		private fb: FormBuilder,
		private httpBranch: BranchService,
		private _snackBar: SnackbarServices,
		private _resetForm: ResetformService,
		public dialogRe: MatDialogRef<AddbranchComponent>,
    	@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private socketService : SocketService
	) {

	

		this.btnName = data.btnName
		this.updateBranch(data)
		
	}

	ngOnInit() {


	}

	 async save() {
		this.progress = true
		try {
			(this.btnName == 'Save') ? 			
			
				await this.httpBranch.saveBranch({ data : this.addbranchform.value, reference : atob(sessionStorage.getItem('type')) })
				.then((response:any)=>{
						
					if(JSON.parse(response).message === 'ok'){
						this._snackBar._showSnack("New Branch Head is Added", 'success')
						this.dialogRe.close();
					}else{
						this._snackBar._showSnack('Try Again', 'error')
					}	
					this.progress = false				
				})
			
			: await this.httpBranch.updateBranch(this.addbranchform.value).then(()=>{
				this._snackBar._showSnack("Successfully change", 'success')
				this.dialogRe.close()
				this.progress = false
			})
			
		} catch(e) {

			this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')
			this.dialogRe.close()
			this.progress = false
		}
	}

	updateBranch(data: any){
		if(this.btnName === 'Save'){
			this.addbranchform = new FormBuilder().group({
				ownerFirstname: ['', [Validators.required]],
				ownerLastname:  ['', [Validators.required]],
				contactNo: 		['', [Validators.required]],
				emailAdd: 		new FormControl('', [Validators.required, Validators.email]),
				address: 		['', [Validators.required]],
				branchName: 	['', [Validators.required]] 
			})
		}else{
			this.addbranchform = this.fb.group({
				ownerFirstname: [data.ownerFirstname, [Validators.required]],
				ownerLastname:  [data.ownerLastname, [Validators.required]],
				contactNo: 		[data.contactNo, [Validators.required]],
				emailAdd: 		[data.emailAdd, [Validators.required, Validators.email]],
				address: 		[data.address, [Validators.required]],
				branchName: 	[data.branchName, [Validators.required]],
				id: data.b_id
			})
		}
		
	}
	resetForm() {
		this.dialogRe.close()
		this.btnName = 'Save'
		this._resetForm.reset(this.addbranchform) 
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
