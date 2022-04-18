import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
	@ViewChild("printMe") printTheDiv!: ElementRef
	displayColumns :any = ['no', 'transaction_name', 'tellerCode', 'collection', 'sales', 'income', 'dateTransacted', 'status']
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	fullname: string;
	email: any;
	contactNo: any;
	branchName: any;
	address: any;
	constructor(private http_wallet : WalletService,
				private http_walletExcel : WalletExcelService,
				private pipeData : SearchByDateWalletHistoryPipe) { }

	async ngOnInit(){
		await this.getOverallWallet()
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			/** Branch head and Admin data here */
		}else{
			const { firstname, lastname, email, contactNo, franchiseName, location } = JSON.parse(atob(sessionStorage.getItem('d')))[0]
			this.fullname = `${firstname} ${lastname}`.toUpperCase()
			this.email = email
			this.contactNo = contactNo
			this.branchName = franchiseName.toUpperCase()
			this.address = location.toUpperCase()
		}
		
	}

	async getOverallWallet(){

		const result : any = await this.http_wallet.getOverallWallet()
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			this.dataSource = new MatTableDataSource<any>(result)
			this.dataSource.paginator = this.paginator
		}else{
			/**this condition will display the data for different branches */
			const res :any = result.filter((x:any)=>{ return x.branchCode === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)
			this.dataSource = new MatTableDataSource<any>(res)
			this.dataSource.paginator = this.paginator
			
		}
		
	}

	exportAsExcel(){
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			
			this.http_walletExcel.exportAsExcelFile(this.pipeData.transform(this.dataSource , this.start, this.end ))
			
		}else{
			/** data export to excel for branches */
			this.http_walletExcel.exportAsExcelFile(this.pipeData.transform(this.dataSource , this.start, this.end ))

		}
	}

	print(){
		this.printTheDiv.nativeElement.click()
	}

}
