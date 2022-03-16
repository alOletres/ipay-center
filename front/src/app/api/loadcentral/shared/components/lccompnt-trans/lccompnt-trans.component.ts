import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { LoadcentralService } from '../../services/loadcentral.service';

import * as data from './../../json/services.json';


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
	constructor(
		private $dialogRef: MatDialogRef<LccompntTransComponent>,
		private http_load : LoadcentralService,
		private _snackBar : SnackbarServices
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

	async submitLoad(){
		
		await this.http_load.sellProduct({
			data				: this.phoneNumberForm.value,
			modelType 			: this.modelType,
			productName 		: this.productName,
			productPromo 		: this.productPromo,
			selectedPromoCodes  : this.selectedPromoCodes
		}).then((response:any)=>{
			console.log(response);
			
		}).catch((err:any)=>{
			this._snackBar._showSnack(err, 'error')
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
