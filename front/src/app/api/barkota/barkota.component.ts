import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import {  Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WalletService } from 'src/app/services/wallet.service';
import { LoadingDialogComponent } from './../../components/loading-dialog/loading-dialog.component';
import { BarkotaService } from './../../services/barkota.service';
import { SnackbarServices } from './../../services/snackbar.service';
import { CotsdialogComponent } from './cotsdialog/cotsdialog.component';
import { accountName } from './../../globals/interface/branch.interface'

import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExcelService } from 'src/app/services/excel.service';
import SocketService from 'src/app/services/socket.service';
@Component({
  selector: 'app-barkota',
  templateUrl: './barkota.component.html',
  styleUrls: ['./barkota.component.scss']
})
export class BarkotaComponent implements OnInit {

	@ViewChild("printMe") printTheDiv!: ElementRef
	companId : any
	destination :any
	originId : any  
	result : any []
	routesOrigin : Observable<any>
	viewAccomodation : Observable<any>
	getAccomodation : Observable<any>
	getdataTicketlist : Observable<any>
	getdataCotslist : Observable<any>
	originIndex : any
	routesForm: any
	bookdate : any
	minDate = new Date();
	displayedColumnss : any [] =['no', 'name', 'aircon', 'remaining', 'seatType', 'totalBook', 'totalCapacity', 'action']
	displayedColumns : any [] =['no','image', 'shippingline', 'vessel', 'departure', 'duration', 'port', 'remarks', 'action']
	displayedColum : any [] =['image', 'shippingLine', 'departure', 'port']
	displayedColumnsss : any [] = ['no', 'routename', 'type', 'details']
	displayedColumnsDetails : any [] = ['no', 'radio', 'routeType', 'routeAccommodationName', 'discountType', 'subtotal', 'grandtotal']
	displayColumnsCotsList : any [] = ['no', 'name', 'topPosition', 'leftPosition', 'isAvailable', 'remarks', 'action']
	driverList :any [] = ['not a driver', 'driver']
	displayColumnTicket : any [] = ['totalTicketAmount', 'terminalFee', 'outletFee', 'systemFee', 'overallTotal']
	dataSource :any
	dataAccomodation : any
	tablemessage :any
	accommodationData : any
	isLinear :boolean = false;
	routesTable : FormGroup
	firstFormGroup : FormGroup
	secondFormGroup : FormGroup
	thirdFormGroup : FormGroup
	fourthGroup : FormGroup
	fifthGroup : FormGroup
	sixthGroup : FormGroup
	contactForm : FormGroup
	voyageId : any
	priceGroupsId : any
	accomodationId : any
	dataTicketlist : any
	dataDetails  :any
	routeName : string = ''
	routeType : string = ''
	detailsTable : boolean = false
	isSelected : boolean =false
	selectDetail : any
	voyagelist : any
	cotsList : any
	cotsName  :any [] = []
	dataCots : any
	birthdate : any
	priceDetailId : any
	disabledOrigin : boolean 
	disabledDestination : boolean 
	value : string
	departureCotId : any
	accomodationNextButton : boolean = true 
	discountType: any;
	showRevalidate : boolean = true
	slideToggleRoutes : boolean = true
	kindOfRoutes : any = 'List of Routes'
	validateSubmitButton : boolean = false
	cotsNextButton : boolean = true
	customerStepperHide : boolean = true
	revalidateTicket : any
	cotsName1: any;
	accommodationMessage: string;

	addPassengerArray : any [] = [{
		id: '',
		firstName : '',
		lastName : '',
		middleInitial : '',
		isDriver : '',
		gender : '',
		birthDate : '',
		// idNumber : '',
		nationality : '',
		discount : '',
		departurePriceId: '',
		departureCotId: '',
		cots : ''
	}]
	returndate : any
	passengerLength: any;
	event: number;
	discountData: any [];
	discountSelectData: any;
	discountArrayData: any;
	discountId: any;
	discountsName: any;
	discountsNames: any[];
	cots : any
	displayTicketTotal: any [] = [];
	dataTicketTotal: any[];
	dataSelectedVessel: any;
	currentWallet: any;
	observableWallet: Observable<any>;
	passengerCount : any
	cotsLength: any;
	compareValue: number;
	total: number = 0;
	serviceCharge: number = 0 ;
	outletServices: number = 0;
	terminalFee: number = 0;
	ticketTotal: number = 0;
	c_wallet: any;
	ipayTotal: number = 0;
	showHideDiv: boolean;
	dateReceipt: any;
	dateNow : any = new Date()
	tellerName: string;
	constructor(
				private cookieService : CookieService,
				private barkotaService : BarkotaService,
				private fb : FormBuilder,
				private _snackBar : SnackbarServices,
				private router : Router,
				private dialog : MatDialog,
				private http_wallet : WalletService,
				private http_auth : AuthenticationService,
				private http_excel : ExcelService,
				private socketService : SocketService) 
		{
			console.log(atob(sessionStorage.getItem('tN')));
			this.routesForm = this.fb.group({
				origin : ['', [Validators.required]],
				destination : ['', [Validators.required]],
				date : [{value:'', disabled: true}, [Validators.required]],
			})
		}

	ngOnInit(){

		console.log(atob(sessionStorage.getItem('code')));
		
		

		if(this.addPassengerArray === undefined){
			this.passengerLength = 0
		}else{
			this.passengerLength = this.addPassengerArray.length
		}
		this.firstFormGroup = this.fb.group({
			firstCtrl : ['',[Validators.required]]

		})

		this.secondFormGroup = this.fb.group({
			secondCtrl : ['',[Validators.required]]
		})

		this.thirdFormGroup = this.fb.group({
			thirdCtrl : ['', [Validators.required]]
		})
		this.fourthGroup = this.fb.group({
			selectDetails : ['', [Validators.required]]
		})
		this.fifthGroup = this.fb.group({
			voyage : ['',[Validators.required]]
		})
		this.contactForm = this.fb.group({
			completeName	: ['', [Validators.required]],
			email           : new FormControl('',[Validators.required, Validators.email]),
			mobileNumber	: new FormControl('', [Validators.required, Validators.maxLength(10)]),
			address 		: ['', [Validators.required]],
			promotion		: ['', [Validators.required]]
		})

		this.sixthGroup = this.fb.group({
			firstName : new FormControl('', [Validators.required]),

		})
		
		
		if(this.cookieService.get('token') === ''){
			this.router.navigate(['/tellerdashboard']);
			this._snackBar._showSnack('Token is Expired Try Again', 'error')
		}else{
			this.function_loadRoutes();
			this.dataSource = ''
			this.tablemessage = "NO RECORD FOUND.. "
		}
	}

	onChange(e:any){

		this.routesOrigin.subscribe(data=>{

			const selectOrigin = parseInt(e)

			this.destination = data[selectOrigin].destinations
			
		})
	}

	function_loadRoutes(){

		const dialogRef = this.dialog.open(LoadingDialogComponent,{disableClose:true})

		const token : any = this.cookieService.get('token')

		this.barkotaService.function_getRoutes({

			token : JSON.parse(token),
			companId : this.companId

		})
		.pipe(
			catchError(error=>{

				this._snackBar._showSnack(error, 'error')
				dialogRef.close()
				return of ([])
		
			})
		).subscribe(response=>{

			this.result = JSON.parse(response)
			this.routesOrigin = new Observable ((observer)=>{ //observable for getting routes

				try{

					observer.next(this.result)

				}catch(e){
					observer.error(e)			
				}
			})
			dialogRef.close()

		})
		dialogRef.close()
	}
	
	async function_submitRoutes(){ 
		if (this.bookdate === undefined){

			this._snackBar._showSnack('Please Fill Date Departure', 'error')
			
		}else{

			const dialogRef = this.dialog.open(LoadingDialogComponent,{disableClose:true})
		    this.routesForm.disable();
			this.routesOrigin.subscribe(data=>{const selectOrigin = parseInt(this.routesForm.value.origin)
			this.originId = data[selectOrigin].origin.id})

			const token : any = this.cookieService.get('token') 
			await this.barkotaService.function_listOfTrips({

				token : JSON.parse(token),
				origin_id : this.originId,
				data : this.routesForm.value,
				departure_date : this.bookdate.toISOString().slice(0, 10)

			}).then((response)=>{
				if(JSON.parse(response).length === 0){
					this.dataSource = ''
					this.tablemessage ="NO AVAILABLE TRIPS"
					this._snackBar._showSnack('NO AVAILABLE TRIPS', 'error')
					dialogRef.close()
				}else{

					this.dataSource = JSON.parse(response)

					this.viewAccomodation = new Observable((observer)=>{
						try{
							observer.next(this.dataSource)
						}catch(e){
							console.log(e);
							
						}
					})
					dialogRef.close()
				}
				
			}).catch(err=>{
				console.log(err);
				dialogRef.close()
			})
			
		}
	}

	function_getAccomodation(data:any, i :any){
		
		this.dataSelectedVessel = Array(data)
		const dialog = this.dialog.open(LoadingDialogComponent,{disableClose:true})

		this.viewAccomodation.subscribe((data: any)=>{

			if(data[i].priceGroups.length === 0){
				this.dataAccomodation = ''
				this._snackBar._showSnack('NO AVAILABLE ACCOMODATION', 'error')
			}else{
				this.dataAccomodation = data[i].priceGroups[0].accommodations
			}
			
		})
		this.getAccomodation = new Observable((observer)=>{
			try{
				observer.next(parseInt(i))
			}catch(e){
				console.log(e);
			}
		})
		dialog.close()
	}
	 function_selectAccommodation(data : any, i:any){
		// console.log(data, i);
		
		const dialog = this.dialog.open(LoadingDialogComponent,{disableClose:true})

		this.accomodationId = data.id
		console.log(this.dataSource);
		
		this.getAccomodation.subscribe((index :any)=>{
			
			this.voyageId = this.dataSource[parseInt(index)].voyage.id 
			this.priceGroupsId = this.dataSource[parseInt(index)].priceGroups[0].id
		})

		const token : any = this.cookieService.get('token')
		
		 this.barkotaService.function_ticketPrice({

			token : JSON.parse(token),
			voyageId: this.voyageId,
			priceGroupsId : this.priceGroupsId,
			routeAccommodationId : this.accomodationId
			
		})
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				dialog.close()
				return of ([])
			})
		).subscribe(response=>{
			this.dataTicketlist = JSON.parse(response)
			dialog.close()
		})
		
	}

	function_viewDetails(data:any){
		this.detailsTable = true
		this.routeName = data.routePriceName
		this.routeType = data.routePriceType.name
		console.log(data.details);
		
		this.dataDetails = data.details
		
	}

	function_choiceTicket(data:any, i : any, id:any){
	
		const dialogRef = this.dialog.open(LoadingDialogComponent,{disableClose:true})

		this.priceDetailId = data[i].priceDetailId
		
		this.addPassengerArray[this.addPassengerArray.findIndex(item => item.id === id)].departurePriceId 	= this.priceDetailId

		this.function_submitCustomerDetails(id)

		const token : any = this.cookieService.get('token')

		 this.barkotaService.function_getVoyageCots({

			token 					: JSON.parse(token),
			voyageId 				: this.voyageId,
			routeAccommodationId 	: this.accomodationId

		}).pipe(
			catchError(error => {

				this._snackBar._showSnack(error, 'error');
				dialogRef.close();
				return of([]);
			})
		).subscribe(data => {
			
			this.accomodationNextButton = false
			this.discountType = i
			
			this.cotsLength = JSON.parse(data).length
			// console.log(this.cotsLength);
			
				if(this.cotsLength === this.compareValue ){
					console.log('true');
				}else{
					JSON.parse(data).forEach((element: any) => {
						
						this.cotsName.push(element)
						
					});
					this.compareValue = this.cotsName.length
				}
				
			dialogRef.close();
			this.function_checkWalletFirst()
		})
	}
	function_hideTable(){
		this.detailsTable = false
	}

	function_voyageChange(e:any){

		console.log('display cots');
	}

	 function_submitCustomerDetails(id:any){

		const loadingDialog = this.dialog.open(LoadingDialogComponent,{disableClose:true})
		
		const token : any = this.cookieService.get('token')
		
		 this.barkotaService.function_computeCharges({

			token 				: JSON.parse(token),
			passengerList 		: this.addPassengerArray,
			departurePriceId 	: this.priceDetailId,
			cargo 				: this.voyageId,
			discountType 		: this.discountType

		}).pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				loadingDialog.close()
				return of([])
			})
		).subscribe(response =>{
			
			if(this.displayTicketTotal[this.displayTicketTotal.findIndex(item => item.id === id)]){

				this.displayTicketTotal[this.displayTicketTotal.findIndex(item => item.id === id)].ticketTotal 		= JSON.parse(response).ticketTotal
				this.displayTicketTotal[this.displayTicketTotal.findIndex(item => item.id === id)].terminalFee 		= JSON.parse(response).terminalFee
				this.displayTicketTotal[this.displayTicketTotal.findIndex(item => item.id === id)].outletServiceFee = JSON.parse(response).outletServiceFee
				this.displayTicketTotal[this.displayTicketTotal.findIndex(item => item.id === id)].serviceCharge 	= JSON.parse(response).serviceCharge
				this.displayTicketTotal[this.displayTicketTotal.findIndex(item => item.id === id)].total 			= JSON.parse(response).total
			
			}else{
				this.displayTicketTotal.push({
					id 					: id,
					ticketTotal 		: JSON.parse(response).ticketTotal,
					terminalFee 		: JSON.parse(response).terminalFee,
					outletServiceFee 	: JSON.parse(response).outletServiceFee,
					serviceCharge 		: JSON.parse(response).serviceCharge,
					total 				: JSON.parse(response).total
				})
			}
			console.log(this.displayTicketTotal);
			var ticketTotal = 0
			var terminalFee = 0
			var outletServiceFee  = 0
			var serviceCharge = 0
			var total = 0
			for (let index = 0; index < this.displayTicketTotal.length; index++) {
				
				ticketTotal 		+= this.displayTicketTotal[index].ticketTotal
				terminalFee 		+= this.displayTicketTotal[index].terminalFee
				outletServiceFee 	+= this.displayTicketTotal[index].outletServiceFee
				serviceCharge 		+= this.displayTicketTotal[index].serviceCharge
				total 				+= this.displayTicketTotal[index].total
				
			}
			this.ticketTotal = ticketTotal
			this.outletServices =30
			this.serviceCharge = 20
			this.total = total

			this.ipayTotal = 30 + 20 + total
			loadingDialog.close()

		})

	}

	function_refresh(){
		let currentUrl = this.router.url;
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		this.router.navigate([currentUrl]);
	}

	function_showRevalidate(e:any){
		(e.checked) ? `${this.slideToggleRoutes = true, this.kindOfRoutes = 'List of Routes', this.customerStepperHide = true, this.validateSubmitButton = false, this.cotsNextButton = true}` : `${this.slideToggleRoutes = false, this.kindOfRoutes = 'Revalidate Ticket', this.customerStepperHide = false, this.validateSubmitButton = true, this.cotsNextButton = false}` 
	}


	 function_revalidateTicket (){
		console.log(this.priceDetailId, this.voyageId, this.revalidateTicket, this.departureCotId);
		const token : any = this.cookieService.get('token')
		try{
			 this.barkotaService.function_revalidateTicket({
				
				token : JSON.parse(token),
				ticketId : this.revalidateTicket,
				newVoyageId : this.voyageId,
				cotno : this.departureCotId,
				newPriceDetailId : this.priceDetailId
		
			}).pipe(
				catchError(error => {

					this._snackBar._showSnack(error, 'error');
	
					return of([]);
				})
			).subscribe(response=>{
				window.open(JSON.parse(response).printUrl)
				this._snackBar._showSnack('Successfully Revalidate', 'success')
			})
		}catch(e){
			console.log(e);
			
		}
	}

	function_addPassenger(){
		this.passengerLength = this.addPassengerArray.length
	}

	function_remove(data:any){
		this.addPassengerArray.splice(this.addPassengerArray.indexOf(data), 1)
		this.passengerLength = this.addPassengerArray.length
	}

	function_checkNumber(e:any){
		this.event = parseInt(e.length)
	}

	function_showCots(id:any){
		const dialogRef = this.dialog.open(CotsdialogComponent,{
			width : '800px',
			// disableClose : true,
			data : {
				cots : this.cotsName
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			// console.log(result);
			
			this.addPassengerArray[this.addPassengerArray.findIndex(item => item.id === id)].cots = result.name
			this.addPassengerArray[this.addPassengerArray.findIndex(item => item.id === id)].departureCotId = result.id
			
		})
	}

	 function_checkWalletFirst(){

		const branchCode = atob(sessionStorage.getItem('code'))
		
		 this.http_wallet.function_checkAvailableWallet({
			branchCode : branchCode
		})
		.pipe(
			catchError(error=>{
				this._snackBar._showSnack(error, 'error')
				return of([])
			})
		).subscribe(data=>{
			this.currentWallet = JSON.parse(data)
			this.c_wallet = `${JSON.parse(data)[0].current_wallet.toLocaleString('en-US')}.00`

			this.observableWallet = new Observable((observer)=>{
				observer.next(this.currentWallet)
			})
		})
	}

	function_forBarkotaBookingApi(wallet:any, branchCode:any){
		const token : any = this.cookieService.get('token')
		this.barkotaService.function_bookNow({
			
			passengers 			: this.addPassengerArray,
			contactInfo 		: this.contactForm.value,
			token 				: JSON.parse(token)

		})
		.pipe(
			catchError(error => {

				this._snackBar._showSnack(error, 'error')
				
				return of([]);
			})
		).subscribe((data:any)=>{
			
			if(data.length === 0){
				console.log('Internal error');
			}else{	
					
				var win = window.open(JSON.parse(data).printUrl, '_blank')
				win.focus()
				this._snackBar._showSnack('Successfully Book', 'success')
				this.function_saveDbBarkotaTransactions(JSON.parse(data).printUrl, wallet, branchCode)
			}
			
		})
		
	}

	 function_saveDbBarkotaTransactions( ticketUrl: any, wallet:any, branchCode:any){
		
		this.barkotaService.function_saveBarkotaBookingTransactions({
			
			passengers 			: this.addPassengerArray,
			contactInfo 		: this.contactForm.value,
			departurePriceId 	: this.priceDetailId,
			ticketUrl			: ticketUrl,
			shippingVessel 		: this.dataSelectedVessel,
			displayTicketTotal 	: this.displayTicketTotal,
			currentWallet 		: wallet,
			branchCode			: branchCode,
			userLog 			: atob(sessionStorage.getItem('code')),
			dateNow 			: this.dateNow

		}).pipe(
			catchError(error=>{
				this._snackBar.showSnack(error, 'error')
				return of([])
			})
		).subscribe(data=>{

			this.socketService.sendEvent("eventSent", {data: "decreased_wallet"})/**SOCKET SEND EVENT */

			this.printReceipt(data)
		
		})

	}

	async function_bookNow(){
		
		Swal.fire({
			title: 'Make sure all the fields are correct',
			text: 'Press confirm to proceed',
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Read Again'
		}).then((result) => {
			if (result.value) {
					// continue booking
				const dialogref = this.dialog.open(LoadingDialogComponent,{disableClose : true})
				
				this.function_checkWalletFirst() //this function will check the availability of wallet branches
			
					setTimeout(() => { //delay the process  to get the wallet data

					this.observableWallet.subscribe(data=>{
						
						if (data[0].current_wallet > 5000 ){
							
							this.function_forBarkotaBookingApi(data[0].current_wallet, data[0].branchCode)
							dialogref.close()
						
						}else if(data[0].current_wallet <= 5000){

							Swal.fire({
								title: 'Are you sure want to Continue?',
								text: 'Your wallet balance almost reach the amount limit',
								icon: 'warning',
								showCancelButton: true,
								confirmButtonText: 'Yes, Continue',
								cancelButtonText: 'No, keep it'
							}).then((result) => {
								if (result.value) {
										// continue booking
										this.function_forBarkotaBookingApi(data[0].current_wallet, data[0].branchCode)
										dialogref.close()
										
								} else if (result.dismiss === Swal.DismissReason.cancel) {
										
									Swal.fire(
									'Cancelled',
									'Your Booking is Cancelled',
									'error'
									)
								}
							})
						} else if (data[0].current_wallet <= 1000){
							console.log('wallet <= 5000');
							// cant transact snack bar will appear
							this._snackBar._showSnack('Cant Proceed Transaction Please Reload before to Continue', 'error')
							dialogref.close()
						}
					})			
				}, 1000);

			}
		})
			
	}
	printReceipt(data:any){
		this.showHideDiv= false;
		this.print(data);
		
	}

	print(no:any){
		this.printTheDiv.nativeElement.click()
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

}


