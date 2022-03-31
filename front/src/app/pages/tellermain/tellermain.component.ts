import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service'
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { accountName } from './../../globals/interface/branch.interface'
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';
import SocketService from 'src/app/services/socket.service';
import { ServiceService } from './service.service';
import moment from 'moment';
@Component({
	selector: 'app-tellermain',
	templateUrl: './tellermain.component.html',
	styleUrls: ['./tellermain.component.scss']
})
export class TellermainComponent implements OnInit {


	doughnutChartLabels: Label[] = ['ELOADS', 'FERRIES', 'Govt Bill Payments'];
	doughnutChartData: MultiDataSet = [
	  []
	];
	doughnutChartType: ChartType = 'doughnut';

	@Input() isMenuOpened: boolean | undefined;
	@Output() isShowSidebar = new EventEmitter<boolean>();

	fullname :any 
	c_wallet: string;
	currentWallet: any;
	activityLogs: any;
	dataHandler: any;
	currentDate: Date;
	message: string;
	barkotaLength: any;
	bottomMessage: string = 'see more...'
	logsDisplay: any = 3
	eloadsIncome: number;
	eloadsDailyTransactions: any;
	multisysLength: number;
	multisysIncome: number;
	
	constructor(
		private router: Router,
		private http_auth : AuthenticationService,
		private _snackBar : SnackbarServices,
		private http_wallet : WalletService,
		private http_teller : ServiceService,
		private socketService : SocketService){ 
		
		// process here
		this.socketService.eventListener("decreased_wallet").subscribe(()=> { 
			this.current_wallet()
			this.barkotaTrans()
			this.eloads()	
			this.multisys()
		})
		this.barkotaTrans()
		this.eloads()
	}

	async ngOnInit(){ 

		this.numberofTransactions()
		
		this.tellerName()
		this.current_wallet()
		this.activitylog()
		this.multisys()
		this.currentDate = new Date ()
		
	}
	async tellerName(){
		try{
			const name : accountName = { firstName : '', lastName : '' }		
			const type :any = atob(sessionStorage.getItem('type'))
			const type_code : any = atob(sessionStorage.getItem('code'))
			const data: any = await this.http_auth.getUser({type: type, type_code: type_code});
			
			name.firstName 	= data[0].firstname
			name.lastName 	= data[0].lastname

			this.fullname 	= `${name.firstName} ${name.lastName}`
			sessionStorage.setItem('tN', btoa(this.fullname))
			

		}catch(err:any){
			this._snackBar._showSnack(err.statusText, 'error')
		}
	}


	current_wallet(){
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
			this.currentWallet = data

			this.c_wallet = `${data[0].current_wallet.toLocaleString('en-US')}.00`
		
		})
	}

	public openMenu(): void {
		this.isMenuOpened = !this.isMenuOpened;

		this.isShowSidebar.emit(this.isMenuOpened);
	}
	async signOutEmit() {

		await this.http_auth.signOut({
			type : atob(sessionStorage.getItem('type')),
			code : atob(sessionStorage.getItem('code'))
		}).then((response : any)=>{
			if(response.message === 'ok'){
				window.sessionStorage.clear();
				this.router.navigate(['/login']);
			}else{
				this._snackBar._showSnack('Try Again', 'error')
			}			
		}).catch(err=>{
			this._snackBar._showSnack(err, 'error')
		})

	}

	async activitylog (){
		const result:any =	await this.http_teller.getLogs()
		
		const data :any = result.filter((x:any)=>{ return x.reference === atob(sessionStorage.getItem('code')) }).map((res:any)=>res) 

		this.activityLogs = data
		
		
	}

	async barkotaTrans(){

		let dateNow = new Date()
		let t_charge = 0
		//  
		
		const res :any =  await this.http_teller.getBarkotaTransactions()
		
		const data :any = res.filter((x:any)=> { 
			return x.transacted_by === atob(sessionStorage.getItem('code')) && moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00" === moment(dateNow).format("YYYY-MM-DD") + "00:00:00"
		}).map((z:any)=>{
			t_charge += z.franchise_charge	
		})
		
		this.dataHandler = t_charge
		this.barkotaLength = data.length
		this.numberofTransactions()
		
	}
	showAll(){
		if(this.bottomMessage === 'see more...'){
			this.logsDisplay = this.activityLogs.length
			this.bottomMessage = 'show less..'
		}else{
			this.logsDisplay = 8
			this.bottomMessage = 'see more...'
		}
	}

	async eloads(){
		let dailyIncome = 0
		
		const object = await this.http_teller.getLoadCentralTransactions()
		const res = Object.values(object)
		const data :any = res.filter((x:any)=>{
			return x.tellerCode === atob(sessionStorage.getItem('code')) && moment(x.createdDate).format("YYYY-MM-DD") + "00:00:00" === moment(this.currentDate).format("YYYY-MM-DD") + "00:00:00"
		}).map((y:any)=>{
			dailyIncome += y.markUp
		})
		this.eloadsIncome = dailyIncome
		this.eloadsDailyTransactions = data.length 

		this.numberofTransactions()
	}


	async multisys(){
		let dailyIncome = 0
		try{
			const data = await this.http_teller.multisys()
			const result = Object.values(data)
			const dataHandler = result.filter((x:any)=> {
				return x.tellerCode === atob(sessionStorage.getItem('code')) && moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00" === moment(this.currentDate).format("YYYY-MM-DD") + "00:00:00"
			}).map((y:any)=>{
				dailyIncome += y.income
			})
			this.multisysIncome = dailyIncome

			this.multisysLength = dataHandler.length
			this.numberofTransactions()
		}catch(err:any){
			this._snackBar._showSnack('Failed to Fetch', 'error' )
		}
	}
	numberofTransactions(){
		this.doughnutChartData = [[this.eloadsDailyTransactions,this.barkotaLength, this.multisysLength]]
	}


	@HostListener('window:unload', ['$event'])
	@HostListener('window:beforeunload', ['$event'])
	unloadHandler() {
		/** Telling the server that client's browser has been unloaded */
		console.log('alejandro');
		
	}
}
