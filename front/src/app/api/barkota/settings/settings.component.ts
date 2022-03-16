import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, filter } from 'rxjs/operators';
import { barkotaReports } from './../../../globals/interface/branch.interface'
// services
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { BarkotaService } from './../../../services/barkota.service'

import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExcelService } from 'src/app/services/excel.service';
// pipes
import { ComputeSalesPipe, ComputeCollectionPipe } from './../../../pipes/compute.pipe';
import { SearchByDatePipe } from './../../../pipes/compute.pipe';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@ViewChild("table", { static: false }) table!: ElementRef;
	displayedColumnsC : any [] = ['contactPerson', 'email', 'mobile', 'landLine', 'address']
	displayedColumnsV : any [] = ['routeCode', 'origin', 'destination', 'vesselName', 'departureDate']
	displayedColumnsT : any [] = ['id', 'bookingReferenceNumber' ,'bookingDate', 'reservationExpiry', 'status', 'total']
	displayedColumns : any [] = ['no', 'companyName', 'passengerName', 'gender', 'discountType', 'accommodation', 'ticketNumber', 'barkotaNumber', 'status', 'action']
	transactions : any [] = ['Search Tickets', 'Search Voucher URL by Ticket', 'Search Voucher URL by Transaction']
	displayedColumss : any [] = ['no', 'code', 'services', 'collection', 'sales', 'income', 'status', 'transacted_date', 'transactedBy'] 
	checkedTransactions : any
	daterange : FormGroup
	searchVoucherForm : FormGroup
	searchTransactionForm : FormGroup
	searchBakotaReportForm: FormGroup
	searchTicketTable : any
	ticketTransactions : any
	transactionInfo: any;
	contactInfo: any;
	voyageVessel: any;
	dataTransactions: any[];
	dataVoyageVessel: any[];
	dataContactInfo: any[];
	contactInfoTable : boolean = false
	voyageVesselTable : boolean = false
	transactionsTable : boolean =false

	dataSourceBarkotaReports : MatTableDataSource<any>
	dataT: any;
	actualData: any;

	start : any
	end :any

	constructor(private fb : FormBuilder,
				private http_barko : BarkotaService,
				private cookieService : CookieService,
				private _snackBar : SnackbarServices,
				private http_auth : AuthenticationService,
				private http_excel : ExcelService,
				private pipeData : SearchByDatePipe
				){
					// constructor init
				}

	ngOnInit(){

		this.searchBakotaReportForm = this.fb.group({
			start 	: new FormControl('', [Validators.required]),
			end 	: new FormControl('', [Validators.required])
		})
		this.daterange = this.fb.group({
			start 			: new FormControl('', [Validators.required]),
			end 			: new FormControl('', [Validators.required]),
			ticketNumber 	: new FormControl('', [Validators.required]),
			firstname 		: new FormControl('', [Validators.required]),
			lastname 		: new FormControl('', [Validators.required])
		})
		this.searchVoucherForm = this.fb.group({
			barkotaTicketId : new FormControl('',  [Validators.required])
		})
		this.searchTransactionForm = this.fb.group({
			barkotaTransactionId : new FormControl('', [Validators.required])
		})

		this.function_getByTellerTransactions() // load reports
	}
	functions_searchTickets(){
		const start = moment(this.daterange.value.start).format().slice(0, 10)
		const end =   moment(this.daterange.value.end).format().slice(0, 10)
		const token : any = this.cookieService.get('token')

		this.http_barko.function_searchTicket({
			dateFrom: start,
			dateTo: end,
			data: this.daterange.value,
			token: JSON.parse(token)
		})
			.pipe(
				catchError(error => {

					this._snackBar._showSnack(error, 'error');

					return of([]);
				})
				
			
			).subscribe(data => {
				// console.log(JSON.parse(data));
				
				if(JSON.parse(data).length === 0 ){
					this._snackBar._showSnack('No available data', 'error');
				}else{
					this.searchTicketTable = JSON.parse(data);
					this.transactionInfo = this.searchTicketTable[0].transactionInfo;
					this.contactInfo = this.searchTicketTable[0].transactionInfo.contactInfo
					this.voyageVessel = this.searchTicketTable[0].voyage
				}
			})
		
	}

	function_showTransactions(){
		this.dataTransactions = Array(this.transactionInfo)
		this.voyageVesselTable = false
		this.contactInfoTable = false
		this.transactionsTable = true
	}
	function_showVoyageVessel(){
		this.dataVoyageVessel = Array(this.voyageVessel)
		this.voyageVesselTable = true
		this.contactInfoTable = false
		this.transactionsTable = false
	}
	function_showContactInfo(){
		this.dataContactInfo = Array(this.contactInfo)
		this.contactInfoTable =true
		this.voyageVesselTable = false
		this.transactionsTable = false
		
	}
	functions_searchVoucherbYborkotaId(){

		const token : any = this.cookieService.get('token')

		this.http_barko.function_searchVoucherByTicket({
			data : this.searchVoucherForm.value,
			token : JSON.parse(token)
		})
		.pipe(
			catchError(error => {

				this._snackBar._showSnack(error, 'error');

				return of([]);
			})
		).subscribe(data => {

			
			if(JSON.parse(data).length === 0){
				this._snackBar._showSnack('Voucher not Available', 'error');
			}else{
				window.open(JSON.parse(data).printUrl)
			}

		})	
	}

	functions_searchsearchTransaction(){

		const token : any = this.cookieService.get('token')
		this.http_barko.function_searchTransactionNo({
			data : this.searchTransactionForm.value,
			token : JSON.parse(token)
		})
		.pipe(
			catchError(error => {

				this._snackBar._showSnack(error, 'error');

				return of([]);
			})
		).subscribe(data => {

			if(JSON.parse(data).length === 0){
				this._snackBar._showSnack('Transaction not Available', 'error');
			}else{
				window.open(JSON.parse(data).printUrl)
			}

		})	
		
	}

	function_getByTellerTransactions(){

		this.http_barko.function_getByTellerTransactions({
			transacted_by : atob(sessionStorage.getItem('code'))
		}).pipe(
			catchError(error =>{
				this._snackBar._showSnack(error, 'error')
				return of ([])
			})
		).subscribe((data :any)=>{

			
			this.dataSourceBarkotaReports = new MatTableDataSource<any>(JSON.parse(data))// display for log user franchise 
			this.dataSourceBarkotaReports.paginator = this.paginator
			this.dataT = data
			
		})
	}
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSourceBarkotaReports.filter = filterValue.trim().toLowerCase();
	}

	print(){

		const branchCode = atob(sessionStorage.getItem('code'))

		this.http_auth.function_getBranchNameOfTeller({
			branchCode : branchCode
		}).pipe(
			catchError((err:any)=>{
				this._snackBar._showSnack(err, 'error')
				
				return of([])
			})
		).subscribe(data=>{

			let printContents, popupWin;
			printContents = document.getElementById('print-section').innerHTML;
			
			popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
			popupWin.document.open();
			popupWin.document.write(`
		  <html>
			<div  fxLayout="row wrap">
				<div class="row">
					<div style ="float : left;" class="col m4">
						<img style = "width: 150px; height : 100px;" src="./../../../assets/img/IPAY_LOGO.png" alt="">
					</div>
					<div class="col m8">
						<p style ="text-transform: capitalize "> ${JSON.parse(data)[0].franchiseName} <br> ${JSON.parse(data)[0].location} <br> +63${JSON.parse(data)[0].contactNo} <br>  </p>
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
					<p style = "text-transform : capitalize"> Teller: ${atob(sessionStorage.getItem('tN'))} </p>
				</div>
	
			</div>
		  </html>`
			);
			popupWin.document.close();
		})

    }

	exportArrayAsExcel(){


		const branchCode = atob(sessionStorage.getItem('code'))

		this.http_auth.function_getBranchNameOfTeller({
			branchCode : branchCode
		}).pipe(
			catchError((err:any)=>{
				this._snackBar._showSnack(err, 'error')
				
				return of([])
			})
		).subscribe(data=>{


			const result = this.pipeData.transform( this.dataSourceBarkotaReports, this.start, this.end)
		
			this.http_excel.exportAsExcelFile(this.table.nativeElement, result, data, atob(sessionStorage.getItem('tN')))

		})
		
	}
}
