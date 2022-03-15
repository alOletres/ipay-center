import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AdminExcelService } from 'src/app/services/admin-excel.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { ModalComponent } from './../../components/modal/modal.component'
import { DialogComponent } from './../../globals/globa_components/dialog/dialog.component'
import { AuthenticationService } from "./../../services/authentication.service"
import { WalletService } from "./../../services/wallet.service"
import { SearchByDateAdminPipe } from "./../../pipes/admin/compute-debit.pipe"
import SocketService from 'src/app/services/socket.service';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {


	[x: string]: any;

	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
	@ViewChild(MatPaginator, {static: false}) paginatorOne: MatPaginator;
	showTable:boolean 
	hideCards : boolean = true
	tableHeader : any
	dataSource :MatTableDataSource<any>
	type : any
	showloadTable : boolean = false
	btnBack : boolean
	displayedColumns: string[] = ['no', 'reference number', 'image', 'transaction date', 'payment date', 'payment status', 'amount'];
	displayedColumnsForSendingLoad:string[] = ['no', 'fBranch', 'teller', 'transactionId', 'services', 'debit', 'credit', 'transaction_date']
	displayWalletMonitoring : any [] = ['no', 'branchName', 'type', 'approved_wallet', 'current_wallet']
	displayTopUploadsHistory : any [] = ['no', 'branchName', 'image', 'referenceNumber', 'transactionDate', 'paymentDate', 'amount', 'status', 'approved_by']
	dataWalletHistory: MatTableDataSource<any>;
	currentWallet: any;
	fWallet: any;
	walletHistoryLength: number;
	userType: string;
	start:any
	end:any
	autoCompleteData: any[] = []
	options: any;
	dataBranchesMonitoring: any;
	franchiseCount: any = 0;
	ibarangayCount : any = 0;
	dataCount : any = 0
	showMonitoredBranches : boolean = false
	dataHandler : any
	showTableForTopUploadHistory : boolean = false
	fullname : any
	progress : boolean = false
	topUpLength : any
	topUpLengthIb : any
	tellerList : any
	@ViewChild('zoomOutImage') zoomOutImage : TemplateRef<any>
	constructor(private dialog : MatDialog,
				private http_auth: AuthenticationService,
				private http_wallet : WalletService,
				private _snackBar : SnackbarServices,
				private http_excel : AdminExcelService,
				private pipeData : SearchByDateAdminPipe,
				private socketService : SocketService,
				private http_branch : BranchService) {

					this.socketService.eventListener("response_ibarangay").subscribe(()=> { 
						this.ngOnInit()
						this.function_showtopup() 
					})
					
					
				}

	searchControl = new FormControl();
	filteredOptions: Observable<any[]>

	async ngOnInit(){

		await this.function_topUpList()
		await this.getTellerlist()
		this.filteredOptions = this.searchControl.valueChanges.pipe(
			startWith(''),
			map(value=>  this._filter(value))
		)
	}

	
	private _filter(value:any) : any[]{

		try{

			const filterValue = value.toLowerCase()

			return this.tellerList.filter((option:any)=>
				option.tellerCode.toLowerCase().includes(filterValue)
			)
		
		}catch(e){
			return undefined
		}
	}

	displayFn(subject:any){
		return subject ? subject.tellerCode : undefined
	}
	
	function_showtopup(){
		
		this.showTable = true
		this.hideCards = false 
		this.tableHeader = 'Top-up Load'
		this.btnBack = true
		this.showTableForTopUploadHistory = false
		this.showloadTable = false
	}
	async function_openTOpLoad (){
		
		const fcode : any = atob(sessionStorage.getItem('code'))
		const data: any = await this.http_auth.getUser({type: this.type, type_code: fcode}); //query for franchise data
		
		const dialogRef = this.dialog.open(ModalComponent, {

			width: '800px',
			disableClose : true,
			data : {
				email 		: data[0].email,
				contactNo 	: `0${data[0].contactNo}`,
				name 		: `${data[0].firstname} ${data[0].lastname}`,
				fcode 		: fcode,
				bcode 		: data[0].branchCode
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			
			this.function_topUpList()
			this.showTable = true
			this.hideCards = false 
			this.showTableForTopUploadHistory = false
			this.tableHeader = 'Top-up Load'
		
		})
	}
	function_back() {
		this.showTable = false
		this.showloadTable = false
		this.hideCards = true
		this.btnBack = false
		this.showMonitoredBranches = false
		this.showTableForTopUploadHistory = false
	}

	function_showloadTable(){
		this.showTableForTopUploadHistory = false
		this.showMonitoredBranches = false
		this.btnBack = true
		this.showloadTable = true
		this.hideCards = false 
		this.tableHeader = 'Send Load to iBarangay'
	}

	function_openSendLoad(){
		const dialogRef = this.dialog.open(DialogComponent, {
			width : '500px',
			disableClose : true,
			data : {
				btnName : 'Send'
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
			this.showTable = false
			this.hideCards = false 
			this.showloadTable = true
			this.tableHeader = 'Send Load to iBarangay'
		})
	}

	function_updateLoadStatus(data:any){
		
		const dialogRef = this.dialog.open(DialogComponent, {
			width : '500px',
			disableClose : true,
			data : {
				id : data.id,
				credit : data.credit_sent,
				ib_code : data.ib_ibrgyyCode,
				load_status : data.load_status,
				btnName : 'Send '
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
			this.showTable = false
			this.hideCards = false 
			this.showloadTable = true
			this.tableHeader = 'Send Load to iBarangay'
		})
	}

	function_walletHistory(){

		this.function_checkFranchiseWallet()
		this.showMonitoredBranches= false
		this.btnBack = true
		this.showTable = false
		this.showloadTable = true
		this.hideCards = false;

		(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head')
		
		? this.http_wallet.function_walletTransactionForAdminBranchHead()
		.pipe(

			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe((data:any)=>{
			
			this.userType = atob(sessionStorage.getItem('code'))
			this.dataWalletHistory = new MatTableDataSource<any>(data)
			this.dataWalletHistory.paginator = this.paginator	
			
			this.autoCompleteData = this.dataWalletHistory.filteredData 
			
			
		})
		
		
		: this.http_wallet.function_walletHistory({
			code : atob(sessionStorage.getItem('code'))
		})
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe((data:any)=>{
			
			this.dataWalletHistory = new MatTableDataSource<any>(data)
			this.dataWalletHistory.paginator = this.paginator	
			this.autoCompleteData = this.dataWalletHistory.filteredData 
			
		})

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

	async function_topUpList(){
		this.progress = true
		this.type = atob(sessionStorage.getItem('type'))
		const result : any = await this.http_wallet.getTopup_list({code : atob(sessionStorage.getItem('code'))}) 
		
		this.dataSource = new MatTableDataSource<any>(result)// display for log user franchise 
		this.dataSource.paginator = this.paginatorOne
		this.progress = false
	}

	print(){
		let printContents, popupWin;
			printContents = document.getElementById('print-section').innerHTML;
			
			popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

			popupWin.document.open();
		if(atob(sessionStorage.getItem('type') ) === 'Admin'){
			popupWin.document.write(`
			<html>
			  <div  fxLayout="row wrap">
				  <div class="row">
					  <div style ="float : left;" class="col m4">
						  <img style = "width: 150px; height : 100px;" src="./../../../assets/img/IPAY_LOGO.png" alt="">
					  </div>
					  <div class="col m8">
						  <p style ="text-transform: capitalize ">  <br>  </p>
					  </div>
				  </div>
	  
				  <br>
				  <head>
					  <style>
						  body{  width: 99%;}
							  label { 
								  font-weight: 400;
								  font-size: 13px;
								  padding: 2px;
								  margin-bottom: 5px;
							  }
							  table, td, th {
								  border: 1px solid silver;
							  }
							  table td {
								  font-size: 13px;
							  }
							  table th {
								  font-size: 13px;
							  }
							  table {
								  border-collapse: collapse;
								  width: 98%;
							  }
							  th {
								  height: 26px;
							  }
					  </style>
				  </head>
				  <body onload="window.print();window.close()">${printContents}</body>
				  <br>
				  <br>
				  <div style="float : right">
				  <hr>
					  <p style = "text-transform : capitalize"> Prepared by: Admin</p>
				  </div>
	  
			  </div>
			</html>`
			  );
		  popupWin.document.close();
		}else{

			const x :any = (atob(sessionStorage.getItem('d')))
			
			const { firstname, lastname, franchiseName, location, contactNo } = JSON.parse(x)[0]

			popupWin.document.write(`
				<html>
				<div  fxLayout="row wrap">
					<div class="row">
						<div style ="float : left;" class="col m4">
							<img style = "width: 150px; height : 100px;" src="./../../../assets/img/IPAY_LOGO.png" alt="">
						</div>
						<div class="col m8">
							<p style ="text-transform: capitalize "> ${franchiseName} <br> ${location} <br> +63${contactNo} <br>  </p>
						</div>
					</div>
		
					<br>
					<head>
						<style>
							body{  width: 99%;}
								label { 
									font-weight: 400;
									font-size: 13px;
									padding: 2px;
									margin-bottom: 5px;
								}
								table, td, th {
									border: 1px solid silver;
								}
								table td {
									font-size: 13px;
								}
								table th {
									font-size: 13px;
								}
								table {
									border-collapse: collapse;
									width: 98%;
								}
								th {
									height: 26px;
								}
						</style>
					</head>
					<body onload="window.print();window.close()">${printContents}</body>
					<br>
					<br>
					<div style="float : right">
					<hr>
						<p style = "text-transform : capitalize"> Prepared by: ${firstname} ${lastname}</p>
					</div>
		
				</div>
				</html>`
			);
		  popupWin.document.close();

		}
	}

	async exportArrayAsExcel(){

		/**
		 * @VALUE Franchise
		 * @VALUE Admin
		 */
		const dataResult = this.pipeData.transform(this.dataWalletHistory, this.start, this.end, this.searchControl) 

		if(atob(sessionStorage.getItem('type')) === 'Admin' ){

			this.http_excel.exportAsExcelFile(dataResult, atob(sessionStorage.getItem('type')), '')
			
		}else{
			

			await this.http_auth.getUser({
				
			   type: atob(sessionStorage.getItem('type')),
			   type_code: atob(sessionStorage.getItem('code'))
		   
		   }).then((data:any)=>{
   
				(atob(sessionStorage.getItem('type')) === 'Branch Head')?  this.fullname = `${data[0].ownerFirstname} ${data[0].ownerLastname}` : this.fullname = `${data[0].firstname} ${data[0].lastname}`
   
		   }).catch(err=>{
				this._snackBar._showSnack(err, 'error')
		   })

		}
	}

	function_walletBranchesMonitoring(){
		this.showMonitoredBranches = true
		this.btnBack = true
		this.showTable = false
		this.hideCards = false
		this.showloadTable = false
		this.showTableForTopUploadHistory = false
		this.http_wallet.walletBranchesMonitoring()
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe((data:any)=>{
			// console.log(data);
			// this.dataBranchesMonitoring = data	
			this.franchiseCount = data.length	
			this.dataBranchesMonitoring = new MatTableDataSource<any>(data)// display for log user franchise 
			this.dataBranchesMonitoring.paginator = this.paginator
		
		})

		this.function_walletiBarangayMonitoring()
	}
	
	function_walletiBarangayMonitoring(){

		this.http_wallet.walletiBarangayMonitoring()
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe((result:any)=>{
			this.dataCount = result.length
			
			this.dataIbarangayMonitoring = new MatTableDataSource<any>(result)
			this.dataIbarangayMonitoring.paginator = this.paginator
		})
	}

	function_topUploadsIbarangayHistory(){
		this.showTableForTopUploadHistory = true
		this.hideCards = false
		this.btnBack = true
		this.showMonitoredBranches = false
		this.showTable = false
		this.showloadTable = false
		this.s
		this.http_wallet.topUploadsIbarangayHistory()
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe((data:any)=>{

			this.dataTopUploadIb = data
			this.topUpLengthIb = data.length
			this.globalPaginations(data)

			this.function_topUploadsFranchiseeHistory()
		})
	}

	function_topUploadsFranchiseeHistory(){

		this.http_wallet.topUploadsFranchiseeHistory()
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe((data:any)=>{

			this.dataHandlerforFranchise = new MatTableDataSource<any>(data)
			this.dataHandlerforFranchise.paginator = this.paginator
			this.topUpLength = data.length
		})
	}

	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataBranchesMonitoring.filter = filterValue.trim().toLowerCase();
	}
	applyFilterOne(event:Event):void{
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataIbarangayMonitoring.filter = filterValue.trim().toLowerCase();
	}
	applyFilterTwo(event:Event):void{
		
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataHandlerforFranchise.filter = filterValue.trim().toLowerCase();
	}
	applyFilterThree(event:Event):void{
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataHandler.filter = filterValue.trim().toLowerCase();
	}
	globalPaginations( data:any){

		this.dataHandler = new MatTableDataSource<any>(data)
		this.dataHandler.paginator = this.paginator
	}

	zoomOut(data:any){
		
		this.dialog.open(this.zoomOutImage, {
			width : '500px',
			panelClass: 'myClass' 
		})
		this.image = data.image
	}
	async getTellerlist(){
		await this.http_branch.getTellerlist()
		.then((result:any) => {
			if(atob(sessionStorage.getItem('type')) === 'Admin'){

				let teller = result.map((x:any)=>x)
				this.tellerList = teller

			}else if(atob(sessionStorage.getItem('type')) === 'Branch Head'){

				let teller =  result.filter((x:any)=>{ return x.branchCode === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)
				this.tellerList = teller
				
			}else if(atob(sessionStorage.getItem('type')) === 'Franchise'){

				let teller =  result.filter((x:any)=>{ return x.fiB_Code === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)
				this.tellerList = teller

			}else{
				let teller =  result.filter((x:any)=>{ return x.ibrgy_code === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)
				this.tellerList = teller
			}
					
		}).catch(() => {
			this._snackBar._showSnack('Failed to Fetch', 'error')
		});
	}
}
