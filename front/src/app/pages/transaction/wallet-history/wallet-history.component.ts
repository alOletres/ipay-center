import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WalletService } from 'src/app/services/wallet.service';
import { WalletExcelService } from './wallet-excel.service';
import { SearchByDateWalletHistoryPipe } from './../../../pipes/admin/compute-debit.pipe'

@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss']
})
export class WalletHistoryComponent implements OnInit {
	start:any
	end : any
	dataSource :any
	displayColumns :any = ['no', 'transaction_name', 'tellerCode', 'collection', 'sales', 'income', 'dateTransacted', 'status']
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	constructor(private http_wallet : WalletService,
				private http_walletExcel : WalletExcelService,
				private pipeData : SearchByDateWalletHistoryPipe) { }

	async ngOnInit(){
		await this.getOverallWallet()
	}

	async getOverallWallet(){

		const result : any = await this.http_wallet.getOverallWallet()
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			console.log('wla pani ako pani buhaton ');
			
		}else{
			/**this condition will display the data for different branches */
			const res :any = result.filter((x:any)=>{ return x.branchCode === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)
			this.dataSource = new MatTableDataSource<any>(res)
			this.dataSource.paginator = this.paginator
		}
		
	}

	exportAsExcel(){
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			console.log('buhaton pa ni nako sa admin');
			
		}else{
			/** data export to excel for branches */
			this.http_walletExcel.exportAsExcelFile(this.pipeData.transform(this.dataSource , this.start, this.end ))

		}
	}

}
