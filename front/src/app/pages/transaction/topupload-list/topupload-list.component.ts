import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import SocketService from 'src/app/services/socket.service';
import { WalletService } from 'src/app/services/wallet.service';

	@Component({
	selector: 'app-topupload-list',
	templateUrl: './topupload-list.component.html',
	styleUrls: ['./topupload-list.component.scss']
	})
export class TopuploadListComponent implements OnInit {
	progress : boolean = false
	paginatorOne: any;
	dataSource: any;
	displayedColumns: string[] = ['no', 'reference number', 'image', 'transaction date', 'payment date', 'payment status', 'amount'];
	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
	@ViewChild('zoomOutImage') zoomOutImage : TemplateRef<any>
	image: any;
		walletHistoryLength: number;
		fWallet: any;
		topUpLength: any;

	constructor(private http_wallet : WalletService,
				private dialog : MatDialog,
				private socketService : SocketService,
				private _snackBar : SnackbarServices) {
					this.socketService.eventListener("response_approvedTopUp").subscribe(()=> {  
						this.ngOnInit()
					})
				}

	async ngOnInit(){
		
		await this.function_topUpList()
		this.function_checkFranchiseWallet()
	}

	async function_topUpList(){

		this.progress = true

		const result : any = await this.http_wallet.getTopup_list({code : atob(sessionStorage.getItem('code'))}) 
		this.topUpLength = result.length
		this.dataSource = new MatTableDataSource<any>(result)
		this.dataSource.paginator = this.paginator
		this.progress = false
	}
	async function_openTOpLoad (){
		
		const fcode : any = atob(sessionStorage.getItem('code'))

		const { email, contactNo, firstname, lastname, branchCode } = JSON.parse(atob(sessionStorage.getItem('d')))[0]
		
		const dialogRef = this.dialog.open(ModalComponent, {

			width: '800px',
			disableClose : true,
			data : {
				email 		: email,
				contactNo 	: `0${contactNo}`,
				name 		: `${firstname} ${lastname}`,
				fcode 		: fcode,
				bcode 		: branchCode
			}
		})
		dialogRef.afterClosed().subscribe(()=>{
			this.ngOnInit()
		
		})
	}

	zoomOut(data:any){
		
		this.dialog.open(this.zoomOutImage, {
			width : '500px',
			// disableClose : true,
			panelClass: 'myClass' 
		})
		this.image = data.image
	}

	function_checkFranchiseWallet(){

		this.http_wallet.function_checkFranchiseWallet({code: atob(sessionStorage.getItem('code'))})
	   .pipe(
		   catchError(error=>{
			   this._snackBar._showSnack(error, 'error')
			   return of ([])
		   })
	   ).subscribe((data:any)=>{

		   ( data.length === 0 ) ? this.walletHistoryLength = 0
		   : this.fWallet = data[0].current_wallet.toLocaleString('en-US')
		   
	   })
   }

}
