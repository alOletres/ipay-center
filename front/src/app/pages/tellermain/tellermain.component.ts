import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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


	doughnutChartLabels: Label[] = [];
	doughnutChartData: MultiDataSet = [ [] ];
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
	logsDisplay: any = 5
	
	constructor(
		private router: Router,
		private http_auth : AuthenticationService,
		private _snackBar : SnackbarServices,
		private http_wallet : WalletService,
		private http_teller : ServiceService,
		private socketService : SocketService){ 
		
		// process here
		this.socketService.eventListener("decreased_wallet").subscribe(()=> { this.current_wallet()})
	}

	async ngOnInit(){
		
		try{

			const name : accountName = {
				firstName : '',
				lastName : ''
			}

			const type :any = atob(sessionStorage.getItem('type'))
			const type_code : any = atob(sessionStorage.getItem('code'))
			const data: any = await this.http_auth.getUser({type: type, type_code: type_code});
			
			name.firstName 	= data[0].firstname
			name.lastName 	= data[0].lastname

			this.fullname 	= `${name.firstName} ${name.lastName}`
			sessionStorage.setItem('tN', btoa(this.fullname))
			

		}catch(err){
			this._snackBar._showSnack(err, 'error')
		}
		

		this.current_wallet()
		this.activitylog()
		this.barkotaTrans()
		this.currentDate = new Date ()
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
			this.currentWallet = JSON.parse(data)

			this.c_wallet = `${JSON.parse(data)[0].current_wallet.toLocaleString('en-US')}.00`
		
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
		
		const data :any = JSON.parse(result).filter((x:any)=>{ return x.reference === atob(sessionStorage.getItem('code')) }).map((res:any)=>res) 

		this.activityLogs = data
		
		
	}

	async barkotaTrans(){
		let dateNow = new Date()
		let t_charge = 0
		//  
		const res : any = await this.http_teller.getBarkotaTransactions()
		// 
		const data :any = JSON.parse(res).filter((x:any)=> { 
			return x.transacted_by === atob(sessionStorage.getItem('code')) && moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00" === moment(dateNow).format("YYYY-MM-DD") + "00:00:00"
		}).map((z:any)=>{
			t_charge += z.franchise_charge	
		})

		this.barkotaLength = data.length
		if(this.barkotaLength === 0){
			this.message = 'NO TRANSACTION TODAY...'
		}else{
			this.doughnutChartLabels = ['Barkota']
			this.doughnutChartData = [ [data.length] ]	
		}

		this.dataHandler = t_charge
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

	
	
}
