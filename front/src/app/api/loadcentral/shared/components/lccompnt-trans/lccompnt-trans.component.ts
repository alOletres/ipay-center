import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import * as data from './../../json/services.json';


@Component({
	selector: 'app-lccompnt-trans',
	templateUrl: './lccompnt-trans.component.html',
	styleUrls: ['./lccompnt-trans.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LccompntTransComponent implements OnInit {

	lcservices: any = (data as any).default;

	modelType: string = ''
	productName: string = ''
	productPromo: string = ''
	types: Array<string>
	searchTxt: string
	searchPromo: string

	productNames: Record<string, any>[]
	ProductPromo: Array<any>
	selectedPromoCodes: any = []

	constructor(
		private $dialogRef: MatDialogRef<LccompntTransComponent>,
	) { }

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
		console.log();
		this.selectedPromoCodes = x[0]
		console.log(this.selectedPromoCodes);

	}

	closeDialog() {
		this.$dialogRef.close()
	}

}


/*******************************

DESCRIPTION_EQUIVALENT
LCPRODUCTCODE
PRODUCTNAME
VALIDITY


 *
 */
