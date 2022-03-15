import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ResetformService } from 'src/app/services/resetform.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';


export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}


@Component({
	selector: 'app-tellersettings',
	templateUrl: './tellersettings.component.html',
	styleUrls: ['./tellersettings.component.scss']
})
export class TellersettingsComponent implements OnInit {
	hide = true;
	hide1 = true
	hide2 = true
	progress :boolean 
	changePasswordForm: FormGroup = new FormGroup({});

	constructor(
		private fb: FormBuilder,
		private http_aut : AuthenticationService,
		private _snackBar : SnackbarServices,
		private resetForm : ResetformService
	) {
		this.changePasswordForm = this.fb.group({
			currentPassword 	 : ['', [Validators.required]],
			newPassword 		 : ['', [Validators.required]],
			compareToNewPassword : ['', [Validators.required]]
		}, { 
			validator: ConfirmedValidator('newPassword', 'compareToNewPassword')
		})
	}

	ngOnInit(){
		
	}

	get f(){
		return this.changePasswordForm.controls;
	  }

	async submitChanges(){
		this.progress = true
		await this.http_aut.tellerChangePassword({
			data : this.changePasswordForm.value,
			user : atob(sessionStorage.getItem('code'))
		})
		.then((res:any)=>{

			if(res.message === 'ok'){
				this._snackBar._showSnack('Successfully Change', 'success')
				this.resetForm.reset(this.changePasswordForm)
				
			}else if(res.message === 'notMatch'){
				this._snackBar._showSnack('Current Password is incorrect', 'error')
			}
			this.progress = false
		}).catch(err=>{
			this._snackBar._showSnack(err, 'error')
			this.progress = false
		})
		
	}

}
