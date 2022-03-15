import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BranchService } from "./../../services/branch.service"
import { WalletService } from "./../../services/wallet.service"
import { AuthenticationService } from "./../../services/authentication.service"
import { MatDialog } from '@angular/material/dialog';
import { GlobalDialogComponent } from './../../components/global-dialog/global-dialog.component'
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SnackbarServices } from 'src/app/services/snackbar.service';
/**socket  */
import SocketService from 'src/app/services/socket.service';
	@Component({
	selector: 'app-notifylist',
	templateUrl: './notifylist.component.html',
	styleUrls: ['./notifylist.component.scss']																						
	})
export class NotifylistComponent implements OnInit {

	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild(MatPaginator, {static: true}) paginatorOne: MatPaginator;
	dataSource :any
	dataforTopup:any
	displayedColumns: string[] = ['no', 'date added', 'name', 'branchtype', 'branch code',  'status', 'action'];
	displayedColumnss: string[] = ['no', 'reference number', 'image', 'transaction date', 'payment date', 'remarks', 'payment status', 'amount', 'action'];
	topUplength: any;
	lengthOfBarangay: any;
	@ViewChild('zoomOutImage') zoomOutImage : TemplateRef<any>
	progress : boolean = false
		image: any;
	constructor(private httpbranch : BranchService,
				private dialog : MatDialog,
				private http_wallet : WalletService,
				private http_auth : AuthenticationService ,
				private _snackBar : SnackbarServices,
				private socketService : SocketService) {

					this.socketService.eventListener("response_topUpload").subscribe(()=> {  this.ngOnInit() })
					this.socketService.eventListener("response_approvedTopUp").subscribe(()=> { this.ngOnInit() })
					this.socketService.eventListener("response_addiBarangay").subscribe(()=> { this.function_ibarangayApproval() })
				}

	async ngOnInit(){
		
		if(atob(sessionStorage.getItem('type')) === 'Admin'){

			this.progress = true

			this.http_wallet.function_adminTopUpload()
			.pipe(
				catchError(error =>{
					this._snackBar._showSnack(error, 'error')
					return of ([])
				})
			).subscribe((data:any)=>{

				this.dataforTopup = new MatTableDataSource<any>(data)// display for log user franchise 
				this.dataforTopup.paginator = this.paginatorOne
				this.topUplength = data.length
				this.progress = false
			})

		} else{
			this.progress = true
			const result : any = await this.http_wallet.getTopup_listForBranchHead({code : atob(sessionStorage.getItem('code'))}) 
			
			this.dataforTopup = new MatTableDataSource<any>(result)// display for log user franchise 
			this.topUplength = result.length
			this.dataforTopup.paginator = this.paginatorOne
			this.progress = false
		}

		this.function_ibarangayApproval()
	}

	async function_ibarangayApproval(){

		this.progress = true
		
		const data : any =	await this.httpbranch.getIbarangayForApproval({code : atob(sessionStorage.getItem('code'))})
		
		this.dataSource = new MatTableDataSource<any>(data)// display for log user franchise 
		this.dataSource.paginator = this.paginator		
		this.lengthOfBarangay = data.length
		this.progress = false
	}
	viewforApproval(data:any){

		const dialogRef = this.dialog.open(GlobalDialogComponent, { //modal for approval ibarangay data 
			width: '800px',
			disableClose : true,
			data :{
				codeforNotify : data.ib_ibrgyyCode,
				firstname : data.firstname,
				lastname : data.lastname,
				contactNo : data.contactNo,
				email  : data.email,
				location : data.location,
				date_added :data.date_added,
				id : data.ib_id,
				disabled : false,

				item : 'Sheet',
				btnName : 'Save '
			}
		})

		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
		})
	}

	function_viewforTopup(data:any){

		this.progress = true

		const type : any = atob(sessionStorage.getItem('type'))
		
		this.http_auth.function_getNameOfBranchesForModalAdmin(data)
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe(result=>{
			
			const dialogRef = this.dialog.open(ModalComponent, {
				width : '800px',
				disableClose : true,
				data : {
					type : type,
					remarks : data.remarks,
					amount : data.amount, 
					email : JSON.parse(result)[0].email,
					contactNo : `0${JSON.parse(result)[0].contactNo}`,
					name : `${JSON.parse(result)[0].firstname} ${JSON.parse(result)[0].lastname}`,
					fcode : JSON.parse(result)[0].fbranchCode,
					bcode : JSON.parse(result)[0].branchCode,
					ib_brgy_code : JSON.parse(result)[0].ib_ibrgyyCode,
					image : data.image,
					reference : data.referenceNumber,
					p_date : data.payment_date,
					id : data.id
				}
			})
			
			this.progress = false

			dialogRef.afterClosed().subscribe(results =>{
				this.ngOnInit()
				
			})
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

}
