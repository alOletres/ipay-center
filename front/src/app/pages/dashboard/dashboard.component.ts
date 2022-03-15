import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import {  Label, MultiDataSet } from 'ng2-charts';

import { DashboardService } from './dashboard.service';
import moment from 'moment';
import SocketService from 'src/app/services/socket.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { WalletService } from 'src/app/services/wallet.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {


	dateNow = new Date()
	/**
	 * @Bar Graph
	 */
	
	barChartOptions: ChartOptions = {
		responsive: true,
		scales: { xAxes: [{}], yAxes: [{}] },
	  };

	 
	  barChartType: ChartType = 'bar';
	  barChartLegend = true;
	  barChartPlugins: any = [];
	  
	 
	/**
	* @Params { data: [1110, 5900, 6000, 8100, 8600, 50000], label: 'Company A' }
	*/

	barChartData: ChartDataSets[] = []
	barChartLabels: Label[] = [];

	/**
	 * @donutGraph
	 */
	doughnutChartLabels: Label[] = [];

	doughnutChartData: MultiDataSet = [
		[]
	];
	
	doughnutChartType: ChartType = 'doughnut';
	@Input() isMenuOpened: boolean | undefined;
	@Output() isShowSidebar = new EventEmitter<boolean>();

	fullname :any 

	branchName : any []
	dataHandler: number;
	announcementResult: any;
	customizeToast : boolean = false

	headersMessage : any
	content : any
	currentDate: Date;
	activityLogs: any;
	logsDisplay : any = 8
	bottomMessage: string;
	announceBottomMessage: string;
	annoucementDisplay: any = 5
	messageAnnouncement: string;
	walletHistoryLength: number;
	fWallet: any;
	cardName: string;
  	constructor( private _route : ActivatedRoute, private http_dash : DashboardService, private _snackBar : SnackbarServices,
				 private socketService :SocketService,
				 private http_wallet : WalletService) {

				this.socketService.eventListener("response_Announcement_changeStatus").subscribe(()=> { 

					this.getActiveAnnouncement()
					this.customizeToast = true
					this.headersMessage = 'Information!!'
					this.content = 'New Announcement has been Posted'
					
					setTimeout(() => {
						this.customizeToast = false
					}, 5000);
		
				})
				this.socketService.eventListener("response_newAnnouncement").subscribe(()=> {
					this.getActiveAnnouncement()
		
					this.customizeToast = true
					this.headersMessage = 'Information!!'
					this.content = 'New Announcement has been posted'
					setTimeout(() => {
						this.customizeToast = false
					}, 5000);
				})
				this.socketService.eventListener("decreased_wallet").subscribe(()=> { 
					this.checkFranchiseWallet()
					this.barYear()
					this.barkotaTrans()
				})
				
		
	  }

	async ngOnInit(){
		this.currentDate = new Date()
		this.bottomMessage = 'see more...'
		this.announceBottomMessage = 'see more...'

		await this.barYear()
		await this.barkotaTrans()
		await this.getActiveAnnouncement()
		this.checkFranchiseWallet()
		await this.getLogs()
	}

	async barYear(){

		this.globalGraphVariables()

		let array = ['','','','','','','']
	
		var d = new Date();
		d.toLocaleString()
		
		array.map((n :any, index)=>{ var dateMnsFive = moment(d).subtract(index , 'year')
			
			new Date(dateMnsFive.toISOString())	
			this.barChartLabels.push(dateMnsFive.format("YYYY"))

		})

		const datas : any = await this.http_dash.barGraphData()
		let profit = Object.values(JSON.parse(datas))
		
		
		/**
		 * get first the total collection , sales, income
		 * database and array condition
		*/

		{
			
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			
			profit.filter((item:any)=>{ 

				return item.date_transacted.slice(0,4) === this.barChartLabels[0] 
					   && item.branchCode === atob(sessionStorage.getItem('code')) 
					   || atob(sessionStorage.getItem('type')) === 'Admin'
					   && item.date_transacted.slice(0,4) === this.barChartLabels[0] 
						
			}).map((data:any)=>{
				
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})		

			this.pushingValueToGraph(t_collection, t_sales, t_income)
						
		}

		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ 

				return  item.date_transacted.slice(0,4) === this.barChartLabels[1] 
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin'
						&& item.date_transacted.slice(0,4) === this.barChartLabels[1] 
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})		

			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ 

				return 	item.date_transacted.slice(0,4) === this.barChartLabels[2] 
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
						|| atob(sessionStorage.getItem('type')) === 'Admin'
						&& item.date_transacted.slice(0,4) === this.barChartLabels[2] 
			
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})		

			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}

		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ 

				return 	item.date_transacted.slice(0,4) === this.barChartLabels[3] 
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin'
						&& item.date_transacted.slice(0,4) === this.barChartLabels[3]
			
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})		

			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ 

				return 	item.date_transacted.slice(0,4) === this.barChartLabels[4] 
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
						|| atob(sessionStorage.getItem('type')) === 'Admin'
						&& item.date_transacted.slice(0,4) === this.barChartLabels[4] 
			
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})		

			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ 

				return 	item.date_transacted.slice(0,4) === this.barChartLabels[5]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
						|| atob(sessionStorage.getItem('type')) === 'Admin' 
						&& item.date_transacted.slice(0,4) === this.barChartLabels[5]
			
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})		

			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ 

				return 	item.date_transacted.slice(0,4) === this.barChartLabels[6] 
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
						|| atob(sessionStorage.getItem('type')) === 'Admin'
						&& item.date_transacted.slice(0,4) === this.barChartLabels[6]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})		

			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
	
	}

	async barMonth(){

		this.globalGraphVariables()

		let array = ['','','','','','','']
	
		var d = new Date();
		d.toLocaleString()
		array.map((n :any, index)=>{

			var dateMnsFive = moment(d).subtract(index , 'month')

			new Date(dateMnsFive.toISOString())	

			this.barChartLabels.push(dateMnsFive.format("MMM YYYY"))

		})

		const res : any = await this.http_dash.barGraphData()
		let profit = Object.values(JSON.parse(res))

		/**
		 * get first the total collection , sales, income
		 * database and array condition
		*/

		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ /**compare month and year */
				return 	moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[0]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin' 
						&& moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[0]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ /**compare month and year */
				return 	moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[1]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin'
						&& moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[1]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ /**compare month and year */
				return 	moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[2]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
						|| atob(sessionStorage.getItem('type')) === 'Admin' 
						&& moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[2]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ /**compare month and year */
				return 	moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[3]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin'
						&& moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[3]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ /**compare month and year */
				return 	moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[4]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
						|| atob(sessionStorage.getItem('type')) === 'Admin' 
						&& moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[4]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ /**compare month and year */
				return 	moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[5] 
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin'
						&& moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[5]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0
			profit.filter((item:any)=>{ /**compare month and year */
				return 	moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[6]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin' 
						&& moment(item.date_transacted).format('MMM YYYY') === this.barChartLabels[6]
			})
			.map((data:any)=>{

				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		
	}

	async barWeekly(){

		this.globalGraphVariables()

		let array = ['','','','','','','']
		
		var d = new Date();
		d.toLocaleString()
	
		array.map((number:any, index)=>{

			var dateMnsFive = moment(d).subtract(index , 'day')

			new Date(dateMnsFive.toISOString())	

			this.barChartLabels.push(dateMnsFive.format("dddd Do yyyy"))
			
		})

		const res : any = await this.http_dash.barGraphData()
		let profit = Object.values(JSON.parse(res))


		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0

			profit.filter((item:any)=>{ /**compare week and year */
				return 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[0]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin' 
						&& moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[0]
			})
			.map((data:any)=>{
			
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)

		}

		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0

			profit.filter((item:any)=>{ /**compare week and year */
				return 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[1]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin'
						&& moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[1] 
			})
			.map((data:any)=>{
			
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}

		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0

			profit.filter((item:any)=>{ /**compare week and year */
				return 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[2]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin'
						&& moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[2]
			})
			.map((data:any)=>{
			
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}

		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0

			profit.filter((item:any)=>{ /**compare week and year */
				return 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[3]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin' 
						&& 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[3]
			})
			.map((data:any)=>{
			
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0

			profit.filter((item:any)=>{ /**compare week and year */
				return 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[4]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin' 
						&& moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[4]
			})
			.map((data:any)=>{
			
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0

			profit.filter((item:any)=>{ /**compare week and year */
				return 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[5]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin' 
						&& moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[5]
			})
			.map((data:any)=>{
			
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
		{
			let t_collection = 0
			let t_sales = 0
			let t_income = 0

			profit.filter((item:any)=>{ /**compare week and year */
				return	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[6]
						&& item.branchCode === atob(sessionStorage.getItem('code')) 
					    || atob(sessionStorage.getItem('type')) === 'Admin' 
						&& 	moment(item.date_transacted).format('dddd Do yyyy') === this.barChartLabels[6]
			})
			.map((data:any)=>{
			
				t_collection += data.collection
				t_sales 	 += data.sales
				t_income 	 += data.income

			})	
			this.pushingValueToGraph(t_collection, t_sales, t_income)
		}
	}

	globalGraphVariables(){
		this.barChartLabels = []
		this.barChartData = [
			{ data:[], label : 'Total Collections'},
			{ data:[], label : 'Total Sales'	  },
			{ data:[], label : 'Total Income'	  }	
		]
	}

	pushingValueToGraph(t_collection:any, t_sales:any, t_income:any){
		
		this.barChartData[0].data.push(t_collection)
		this.barChartData[1].data.push(t_sales)
		this.barChartData[2].data.push(t_income)
	}

	async barkotaTrans(){
		const res : any = await this.http_dash.getBarkotaTransactions()
		let dataHandler = Object.values(JSON.parse(res))
		
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){

			
			this.doughnutChartLabels = ['Barkota']
			this.doughnutChartData = [ [dataHandler.length] ]
			let t_charge = 0
			dataHandler.map((charge:any)=>{
				t_charge += charge.ipayService_charge
			})
			this.dataHandler = t_charge

		}else{

			this.doughnutChartLabels = ['Barkota']
			let t_charge = 0

			let result  = dataHandler.filter((x:any)=> {
				return x.branchCode === atob(sessionStorage.getItem('code'))
			}).map((charge:any)=>{
				t_charge += charge.franchise_charge
			})
			this.dataHandler = t_charge
			
			this.doughnutChartData = [ [result.length] ]
			
		}
	}

	async getActiveAnnouncement(){
		/** mao ni modawat sa response sa socket if naay update mahitabo or  naay bag.o */
		const res:any =  await this.http_dash.displayAnnouncement()
		let result = JSON.parse(res).filter((data:any)=> { return data.status === 0})
		if(result.length === 0){
			this.messageAnnouncement = 'NO ANNOUNCEMENT POSTED'
			this.announcementResult = result.length
		}else{
			this.announcementResult = result
		}

		
	}

	async getLogs(){
		
	    const result:any =	await this.http_dash.getLogs()
		
		const data :any = JSON.parse(result).filter((x:any)=>{ return x.reference === atob(sessionStorage.getItem('code')) }).map((res:any)=>res) 

		this.activityLogs = data	
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
	showAllAnnouncement() {
		if(this.announceBottomMessage === 'see more...'){
			this.annoucementDisplay = this.announcementResult.length
			this.announceBottomMessage = 'show less...'
		}else{
			this.annoucementDisplay = 5
			this.announceBottomMessage = 'see more...'
		}
	}

	checkFranchiseWallet(){

		if(atob(sessionStorage.getItem('type')) === 'Admin' ){

			this.fWallet = moment(new Date()).format('lll')
			this.cardName = 'DATE'
			
		}else{
			this.http_wallet.function_checkFranchiseWallet({code: atob(sessionStorage.getItem('code'))})
			.pipe(
				catchError(error=>{
					this._snackBar._showSnack(error, 'error')
					return of ([])
				})
			).subscribe((data:any)=>{

				( data.length === 0 ) ? this.fWallet = 0
				: this.fWallet = data[0].current_wallet.toLocaleString('en-US')
				this.cardName = 'WALLET'
				
			})
		}
   }

}
