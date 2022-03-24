import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WalletService } from './../../services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarServices } from './../../services/snackbar.service';
import moment from 'moment';
import SocketService from 'src/app/services/socket.service';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

	url : string | ArrayBuffer = './../../../assets/img/notfound.png'

    creditLoadForm:any
    remarks:any
	reference : any
    code: any
	amount : any
	type : any
	id : any
	disabletext : boolean
	myDatePicker: any
	image : any
	files: File[] = [];
	ib_code: any;
	f_code: any;
	progress : boolean = false
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
    	@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private fb : FormBuilder,
        private http_wallet : WalletService,
        private _snackBar: SnackbarServices,
		private socketService : SocketService
    ) {

		this.ib_code = data.ib_brgy_code
		this.f_code = data.fcode
		this.type = data.type
		this.id = data.id
		this.disabletext = false
		
        if(data.type === 'Branch Head' || data.type === 'Admin' ){
			this.disabletext = true
			this.remarks = data.remarks
			this.image = data.image
			
			this.creditLoadForm = this.fb.group({
				reference : [{value : data.reference, disabled : true}, [Validators.required]],
                credit: [data.amount, [Validators.required]],
				date_trans: [{value : data.p_date, disabled : true}, [Validators.required]],
				image : ['', [Validators.required]],
                email: [{value : data.email, disabled : true }, [Validators.required]],
                contact: [{value : data.contactNo, disabled : true}, [Validators.required]],
                name: [{value : data.name, disabled : true}, [Validators.required]],
                fcode: data.fcode,
                bcode : data.bcode,
				amount : data.amount
            })
        }else{
			this.disabletext = false
            this.creditLoadForm = this.fb.group({
				reference : ['', [Validators.required]],
                credit: ['', [Validators.required]],
				date_trans: ['', [Validators.required]],
				image : ['', [Validators.required]],
                email: [{value : data.email, disabled : true }, [Validators.required]],
                contact: [{value : data.contactNo, disabled : true}, [Validators.required]],
                name: [{value : data.name, disabled : true}, [Validators.required]],
                fcode: data.fcode,
                bcode : data.bcode
            })
        }
        
    }

    ngOnInit(){
        // loading data

    }
    async function_saveCredit(){
		// here
		this.progress = true

		const img = this.url
		
        // DATE AUTOMATIC SAVE
        await this.http_wallet.topupload({img, data : this.creditLoadForm.value, remarks : this.remarks})

		.then((response:any)=>{

			if(JSON.parse(response).message === 'ok'){
				this.socketService.sendEvent("eventSent", { data : "response_topUpload" })
				this._snackBar._showSnack(`Success Change`, 'success')
				this.dialogRef.close();
				this.progress = false
			}else{

				this._snackBar._showSnack(`Try Again`, 'error')
				this.dialogRef.close()
				this.progress = false
			}

		}).catch(err=>{
			this.progress = false
			this._snackBar._showSnack(err, 'error')
		})
		
    }

	async function_approved (){

		const date = new Date();
		const type = atob(sessionStorage.getItem('type'))

		this.progress = true

		if(this.ib_code === undefined){
			
			await this.http_wallet.approvedTopupLoad({
				approved_date : moment(date).format(),
				approved_by : type,
				id : this.id, 
				data : this.creditLoadForm.value,
				fcode : this.f_code
			}).then(()=>{

				this.socketService.sendEvent("eventSent", { data : "response_approvedTopUp" })

				this._snackBar._showSnack(`Success Change`, 'success')
				this.dialogRef.close();
				this.progress = false
			}).catch(error=>{
				this.progress =false
				this._snackBar._showSnack(error, 'error')
			})			
		}else{

			await this.http_wallet.approvedTopupLoad({
				approved_date : moment(date).format(),
				approved_by : type,
				id : this.id, 
				data : this.creditLoadForm.value,
				fcode : this.ib_code
			}).then(()=>{
				this._snackBar._showSnack(`Success Change`, 'success')
				this.dialogRef.close();
				this.progress = false
			}).catch(error=>{
				this.progress = false
				this._snackBar._showSnack(error, 'error')
			})			
		}

		
	}

	function_disapproved (){
		// mag code pako ani sa disapproved top uploads
	}

    closeDialog(){
        this.dialogRef.close();
    }

	onSelectFile(event:any) {	
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]); 
			reader.onload = (event) => { 
				this.url = event.target.result;
			}
		}
	}

}
