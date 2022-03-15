
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BranchService } from 'src/app/services/branch.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
	btnBack : boolean = false
	changePassword : boolean = false
	hide = true;
	hide1 = true
	hide2 = true
	accountInformation : boolean = false
	cards : boolean = true
	changePasswordForm : FormGroup
	accountInformationForm : FormGroup
	newPasswordLength: number;
	name: string;
	searchData: any;
	filteredOptions: Observable<any[]>
	searchControl = new FormControl()
	progress : boolean = false
	constructor( private fb : FormBuilder,
				 private http_auth : AuthenticationService,
				 private http_branch : BranchService,
				private _snackBar : SnackbarServices) {

		
	}

	async ngOnInit(){
		const type :any = atob(sessionStorage.getItem('type'))
		const type_code : any = atob(sessionStorage.getItem('code'))
		console.log(type);
		
		
		await this.http_auth.getUser({
			type: type, type_code: type_code
		}).then((response: any)=>{
		
			(type === 'Branch Head')? 
				this.accountInformationForm = this.fb.group({
					ownerFirstname 	: new FormControl(response[0].ownerFirstname, [Validators.required]),
					ownerLastname 	: new FormControl(response[0].ownerLastname, [Validators.required]),
					contactNo 		: new FormControl(response[0].contactNo, [Validators.required]),
					emailAdd 		: new FormControl(response[0].emailAdd, [Validators.required]),
					address 		: new FormControl(response[0].address, [Validators.required]),
					branchName 		: new FormControl({value : response[0].branchName, disabled : true}, [Validators.required]),
					id				: response[0].b_id
		
				})
			: 	this.accountInformationForm = this.fb.group({
				ownerFirstname 	: new FormControl(response[0].firstname, [Validators.required]),
				ownerLastname 	: new FormControl(response[0].lastname, [Validators.required]),
				contactNo 		: new FormControl(response[0].contactNo, [Validators.required]),
				emailAdd 		: new FormControl(response[0].email, [Validators.required]),
				address 		: new FormControl(response[0].location, [Validators.required]),
				branchName 		: new FormControl({value : response[0].franchiseName, disabled : true}, [Validators.required]),
				id				: response[0].b_id
	
			})
			
		}).catch(err=>{
			console.log(err);
			
		})

		switch(atob(sessionStorage.getItem('type'))){
			case 'Branch Head':
				this.name = 'BRANCH' 
			break;
			case 'Franchise':
				this.name = 'TELLER'
			break;

			case 'iBarangay':
				this.name = 'TELLER'
			break;
			
			default:
		}
		
		this.function_changePasswordForm()

		// this.filteredOptions = this.searchControl.valueChanges.pipe(
		// 	startWith(''),
		// 	map((value :any)=>  this._filter(value))
		// )
		
	}
	// private _filter(value:any) : any[]{

	// 	try{
	// 		const filterValue = value.toLowerCase()
			
	// 		return this.searchData.filter((option:any)=>
	// 			option.tellerCode.toLowerCase().includes(filterValue)
	// 		)
		
	// 	}catch(e){
	// 		return undefined
	// 	}
	// }

	// displayFn(subject:any){
		
	// 	return subject ? subject.tellerCode : undefined
	// }

	function_changePasswordForm(){

		this.changePasswordForm = this.fb.group({
			// username			 : new FormControl('', [Validators.required]), 
			currentPassword 	 : new FormControl('', [Validators.required]),
			newPassword 		 : new FormControl('',[Validators.required]),
			compareToNewPassword : new FormControl('', [Validators.required])
		})
	}
	function_updateAccountInformation(){

		this.progress = true

		if( atob(sessionStorage.getItem('type')) === 'Branch Head'){

			this.http_branch.updateBranch(this.accountInformationForm.value)

			.then(()=>{
				this.ngOnInit()
				this._snackBar._showSnack('Successfully Updated', 'success')
				this.progress = false
			}).catch(error=>{
				this.progress = false
				this._snackBar._showSnack(error, 'error')
			})

		}else{


			this.http_auth.updateAccountInformationBranches({

				type : atob(sessionStorage.getItem('type')),
				code : atob(sessionStorage.getItem('code')),
				data : this.accountInformationForm.value

			}).pipe(
				catchError(error=>{
					this.progress = false
					this._snackBar._showSnack(error, 'error')
					return of ([])
				})
			).subscribe((data:any)=>{
				this.ngOnInit()
				this._snackBar._showSnack('Successfully Updated', 'success')
				this.progress = false
			})
		}
		
	}

	function_showAccountInformation(){
		this.cards = false
		this.accountInformation = true
		this.changePassword = false
		this.btnBack = true
	}
	function_back(){
		this.changePassword = false
		this.cards = true
		this.accountInformation = false
		this.btnBack = false
	}
	function_showChangePassword(){
		this.cards = false
		this.changePassword = true
		this.accountInformation =false
		this.btnBack = true
	}
	function_updatePassword(){

		this.progress = true
		if(this.changePasswordForm.value.newPassword.length < 8){
			this._snackBar._showSnack('Please provide 8 characters to create strong password', 'error')
			this.progress = false
		}else if(this.changePasswordForm.value.newPassword !== this.changePasswordForm.value.compareToNewPassword){

			this._snackBar._showSnack('Password not match', 'error')
			this.progress = false
		}else{

			// this.http_auth.changePasswordForBranches({
				
			// 	type : atob(sessionStorage.getItem('type')),
			// 	code : atob(sessionStorage.getItem('code')),
			// 	data : this.changePasswordForm.value
				
			// }).pipe(
			// 	catchError(error=>{
			// 		this._snackBar._showSnack(error, 'error')
			// 		return of([])
			// 	})
			// ).subscribe((data:any) =>{

				
			// 	if(JSON.parse(data).message === 'undefined'){

			// 		this._snackBar._showSnack('Undefined Current Password', 'error')

			// 	}else if (JSON.parse(data).message === 'NotMatch'){

			// 		this._snackBar._showSnack('Please Contact Technical Support', 'error')
				
			// 	} else if (JSON.parse(data).message === 'ok'){

			// 		this._snackBar._showSnack('Successfully Change', 'success')
			// 		this.function_changePasswordForm()	
				
			// 	}
			// })
			  
			
			this.http_auth.function_changePassword({

				type : atob(sessionStorage.getItem('type')),
				code : atob(sessionStorage.getItem('code')),
				data : this.changePasswordForm.value

			}).pipe(
				catchError(error=>{
					this.progress = false
					this._snackBar._showSnack(error, 'error')
					return of([])
				})
			).subscribe(data=>{
								
				if(JSON.parse(data).message === 'ok'){

					(data.length === 0)? this._snackBar._showSnack('Please check your username and password', 'error') : `${this._snackBar._showSnack('Successfully Change', 'success')} ${this.ngOnInit()} `
					this.progress = false
				}else if (JSON.parse(data).message === 'undefined'){

					this._snackBar._showSnack('Undefined Current Password', 'error')	
					this.progress = false
				}else{

					this._snackBar._showSnack('Please Contact Technical Support', 'error')
					this.progress = false
				}			
			})
		}
	}	

	// async searchUsername(){

	// 	if(atob(sessionStorage.getItem('type')) === 'Branch Head'){

	// 	}else{
	// 		const res = await this.http_branch.getTellerlist()
	// 		let r = Object.values(res)
	
	// 		const data = r.filter((x:any)=>{
	// 			return x.fiB_Code === atob(sessionStorage.getItem('code'))
	// 		}).map((result:any)=>{
	// 			return result
	// 		})
	
	// 		this.searchData = data
			
	// 	}
		
	// }
 
}
