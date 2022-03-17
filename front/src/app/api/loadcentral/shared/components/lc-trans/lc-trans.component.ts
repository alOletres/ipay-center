import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { LoadcentralService } from '../../services/loadcentral.service';
import { LccompntTransComponent } from '../lccompnt-trans/lccompnt-trans.component';

@Component({
	selector: 'app-lc-trans',
	templateUrl: './lc-trans.component.html',
	styleUrls: ['./lc-trans.component.scss']
})
export class LcTransComponent implements OnInit {
	dataSource: any;
	displayedColums : any = ['no', 'reference_id', 'TransId', 'mobileNo', 'productCode', 'amount', 'markUp', 'ePIN', 'createdBy', 'createdDate', 'status']
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	constructor(
		private $dialog: MatDialog,
		private http_load : LoadcentralService,
		private _snackBar : SnackbarServices
	) { }

	async ngOnInit(){
		await this.getLoadCentralTransiactions()
	}

	openDialogLC() {
		this.$dialog.open(LccompntTransComponent,  {
			width: '400px',
			disableClose : true,
		})
	}

	async getLoadCentralTransiactions(){
		await this.http_load.getLoadCentralTransactions()
		.then((result:any)=>{
			
			const res = result.filter((x:any)=>{ return x.tellerCode === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)

			this.dataSource = new MatTableDataSource<any>(res)// display for log user franchise 
			this.dataSource.paginator = this.paginator

		}).catch(()=>{
			this._snackBar._showSnack('Failed to Fetch', 'error')
		})
	}

}
