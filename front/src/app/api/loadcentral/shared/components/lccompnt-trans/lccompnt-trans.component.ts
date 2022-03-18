import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import Swal from 'sweetalert2';
import { LoadcentralService } from '../../services/loadcentral.service';
import * as data from './../../json/services.json';
import SocketService from 'src/app/services/socket.service';

@Component({
	selector: 'app-lccompnt-trans',
	templateUrl: './lccompnt-trans.component.html',
	styleUrls: ['./lccompnt-trans.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LccompntTransComponent implements OnInit {

	lcservices: any = (data as any).default;

	modelType: string 
	productName: string 
	productPromo: string 
	types: Array<string>
	searchTxt: string
	searchPromo: string

	productNames: Record<string, any>[]
	ProductPromo: Array<any>
	selectedPromoCodes: any = []
	phoneNumberForm : FormGroup
	amount : any
	constructor(
		private $dialogRef: MatDialogRef<LccompntTransComponent>,
		private http_load : LoadcentralService,
		private _snackBar : SnackbarServices,
		private dialog : MatDialog,
		private socketService : SocketService
	) {
		this.phoneNumberForm = new FormBuilder().group({
			contactNo : new FormControl('', [Validators.required, Validators.maxLength(10)])
		})
	}

	ngOnInit() {
		this.types = this.lcservices.map((a: any) => a.TYPE)
	}

	onselectType(e) {
		const selectedType = this.lcservices.filter((a: any) => a.TYPE == e)
		this.productNames = selectedType.map((a: any) => a.LIST)[0]
	}

	onselectProduc(e) {
		const selectedPromo = this.productNames.filter((a: any) => a.PRODUCTNAME == e)
		this.ProductPromo = selectedPromo.map((a: any) => a.PRODUCTS)[0]
	}

	onselectPromo(e) {
		const x = this.ProductPromo.filter((a: any) => a.PRODUCTNAME == e)
		
		this.selectedPromoCodes = x[0]
		this.amount = ''
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
	markup(...data:any){
		/***
		 * 
		 * ELOAD
			10-49		2
			50-99		3
			100-499		5
			500-ABOVE	7

			GAMES
			10-99		7
			100-499		10
			500-999		20
			1000-2499	30
			2500-4999	50
			5000-ABOVE	70

			SATELLITE
			GSAT
			99			3
			200-500		7
			CIGNAL
			200-500		7
			600-1000	10
			SATLITE
			49-199		3
			299			7
		 */
		const amount =   data[2] === '' ? data[3].LCPRODUCTCODE.match(/(\d+)/)[1]
		               : data[2] !== '' ? data[2]
					   : ''
		switch(data[0]){
			
			case 'ELOAD': return  parseInt(amount) === 10  || parseInt(amount) < 50  ? 2 
								: parseInt(amount) === 50  || parseInt(amount) < 99  ? 3 
								: parseInt(amount) === 100 || parseInt(amount) < 499 ? 5
								: parseInt(amount) === 500 || parseInt(amount) > 500 ? 7
								: ''
			case 'GAMES': return  parseInt(amount) === 10  || parseInt(amount) < 100  ? 7 
								: parseInt(amount) === 100 || parseInt(amount) < 500  ? 10
								: parseInt(amount) === 500 || parseInt(amount) < 1000 ? 20
								: parseInt(amount) === 1000 || parseInt(amount) < 2500 ? 30
								: parseInt(amount) === 2500 || parseInt(amount) < 5000 ? 50
								: parseInt(amount) === 5000 || parseInt(amount) > 5000 ? 70
								: '' 
			case 'SATELLITE': return  data[1] === 'GLOBAL SATELLITE (GSAT and GPINOY)' ? parseInt(amount) === 99 ? 3 
																					   : parseInt(amount) === 200 || parseInt(amount) <= 500 ? 7
																					   :'' 
									: data[1] === 'CIGNAL RELOAD CARDS' ? parseInt(amount) === 200 || parseInt(amount) <= 500 ? 7
																		: parseInt(amount) === 600 || parseInt(amount) <= 1000 ? 10
																		: ''
									: data[1] === 'SATLITE by Cignal'   ? parseInt(amount) === 49 || parseInt(amount) <= 199 ? 3 
																		: parseInt(amount) === 299 ? 7 
																		: '' 
									: ''
			default:
		}

	}
	async submitLoad(){
	
		const MARKUP = this.markup(this.modelType, this.productName, this.amount, this.selectedPromoCodes)
		
		 Swal.fire({
			title:  ` Collect Charge &#8369;${MARKUP}.00`,
			text: 'Confirm to Proceed',
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel'
		}).then((result) => {
			if (result.value) {
				Swal.fire({
					title: 'Are you sure to Continue?',
					text: '',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Yes',
					cancelButtonText: 'No'
				}).then((result) => {


					const dialogRef = this.dialog.open(LoadingDialogComponent,{disableClose:true})
					if (result.value) {
						
						this.http_load.sellProduct({
							data				: this.phoneNumberForm.value,
							modelType 			: this.modelType,
							productName 		: this.productName,
							productPromo 		: this.productPromo,
							amount 				: this.amount,
							markup              : MARKUP,
							selectedPromoCodes  : this.selectedPromoCodes,
							tellerCode 			: atob(sessionStorage.getItem('code')),
							createdBy			: atob(sessionStorage.getItem('tN'))
						}).pipe(
							catchError(error=>{
								dialogRef.close()
								this._snackBar.showSnack(error, 'error')
								return of([])
							})
						).subscribe((response:any)=>{
							console.log(response);
							
							if(JSON.parse(response).message === 'ok'){

								this._snackBar._showSnack('Successfully Loaded', 'success')
								this.socketService.sendEvent("eventSent", {data: "response_sucessfullyLoaded"})/**SOCKET SEND EVENT */
								this.socketService.sendEvent("eventSent", {data: "decreased_wallet"})/**SOCKET SEND EVENT */
								
							}else if(JSON.parse(response).message === 'low_wallet'){
								
								this._snackBar._showSnack('Your wallet has reached the 5000 system limit, Please reload to Continue', 'error')
							
							}else if(JSON.parse(response).message === 'lackFunds'){
							
								this._snackBar._showSnack('Insufficient Funds, Please contact technical support', 'error')
							
							}else if(JSON.parse(response).message === 'systemError'){
								this._snackBar._showSnack('Load Central API System Error', 'error')
							}else{
								this._snackBar._showSnack('Successfully Loaded', 'success')
								this.socketService.sendEvent("eventSent", {data: "response_sucessfullyLoaded"})/**SOCKET SEND EVENT */
								this.socketService.sendEvent("eventSent", {data: "decreased_wallet"})/**SOCKET SEND EVENT */
								
							}
							dialogRef.close()
						})

					} else if (result.dismiss === Swal.DismissReason.cancel) {
						
						dialogRef.close()	
						
						Swal.fire(
						'Cancelled',
						'',
						'error'
						)
						
					}
				})
			}
		})
	}

}


/*******************************

DESCRIPTION_EQUIVALENT
LCPRODUCTCODE
PRODUCTNAME
VALIDITY


 *
 */
