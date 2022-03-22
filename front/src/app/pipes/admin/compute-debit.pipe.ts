import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'computeDebit'
})
export class ComputeDebitPipe implements PipeTransform {

  transform(sales : any,  ipayCharge? : any): any {
    
    return  parseInt(sales) + ipayCharge

  }

}

@Pipe({
	name: 'computeTotalDebit'
  })
  export class ComputeTotalDebitPipe implements PipeTransform {
  
	transform(data : any ,start? : any, end? : any, code? : any): any {
		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"

			let total = data.filteredData.filter((x:any)=>{
		
				const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"
				
				return atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
						code.value === null && start === undefined && end === undefined ? code.value === null && start === undefined && end === undefined
					:  	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				: atob(sessionStorage.getItem('type')) !== 'Admin' || atob(sessionStorage.getItem('type')) !== 'Branch Head' ?
						code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
					: 	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				:	''
						
			}).reduce((a: number, b: any) =>  {
				let st = b.ipayService_charge + parseInt(b.ticket_totalPrice)
				
				return st += a
				
			}, 0)
			return total 
		
		}catch(err){

			return undefined
		}
  
	}
  
}
@Pipe({
	name: 'computeTotalCreditAdmin'
  })
  export class ComputeTotalCreditAdminPipe implements PipeTransform {
  
	transform(data : any ,start? : any, end? : any, code? : any): any {

		try{

			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"

			let total = data.filteredData.filter((x:any)=>{
		
				const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"
				
				return atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
						code.value === null && start === undefined && end === undefined ? code.value === null && start === undefined && end === undefined
					:  	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				: atob(sessionStorage.getItem('type')) !== 'Admin' || atob(sessionStorage.getItem('type')) !== 'Branch Head' ?
						code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
					: 	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				:	''
						
			}).reduce((a: number, b: any) =>  {
				
				let st = b.ipayService_charge
				
				return st += a
				
			}, 0)
			
			return total 
		
		}catch(err){

			return undefined
		}
  
	}
  
}
@Pipe({
	name: 'computeTotalCreditBranch'
  })
  export class ComputeTotalCreditBranchPipe implements PipeTransform {
  
	transform(data : any,start? : any, end? : any, code? : any): any {

		try{
			
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"

			let total = data.filteredData.filter((x:any)=>{
		
				const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"
				
				return   code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
					   : code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate :  x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

						
			}).reduce((a: number, b: any) =>  {
				
				let st = b.franchise_charge
				
				return st += a
				
			}, 0)
			
			return total 
		
		}catch(err){

			return undefined
		}
  
	}
  
}


@Pipe({
	name: 'searchByDateAdmin'
  })
  export class SearchByDateAdminPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any, code? : any): any {
		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			const payload:any[] = data.filteredData.filter((x: any) => {
				
			const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"
			
		return atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
						code.value === null && start === undefined && end === undefined ? code.value === null && start === undefined && end === undefined
					:  	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				: atob(sessionStorage.getItem('type')) !== 'Admin' || atob(sessionStorage.getItem('type')) !== 'Branch Head' ?
						code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
					: 	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				:	''
			
			})
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}


@Pipe({
	name: 'eloadsDailyTotal'
  })
  export class EloadDailtyTotalPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any ,code? : any): any {
		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			const payload = data.filteredData.filter((x: any) => {
				const fdate = moment(x.createdDate).format("YYYY-MM-DD") + "00:00:00"
				
				return atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
						code.value === null && start === undefined && end === undefined ? code.value === null && start === undefined && end === undefined
					:  	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				: atob(sessionStorage.getItem('type')) !== 'Admin' || atob(sessionStorage.getItem('type')) !== 'Branch Head' ?
						code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
					: 	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				:	''

			}).reduce((a:any , b:any)=>{

				let st = b.amount 
			
				return st += a
			}, 0)
			
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}
@Pipe({
	name: 'eloadsDailyMarkUp'
  })
  export class eloadsDailyMarkUpPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any, code? : any ): any {

		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			
			const payload = data.filteredData.filter((x: any) => {
				const fdate = moment(x.createdDate).format("YYYY-MM-DD") + "00:00:00"

				return atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
								code.value === null && start === undefined && end === undefined ? code.value === null && start === undefined && end === undefined
							:  	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
							: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

						: atob(sessionStorage.getItem('type')) !== 'Admin' || atob(sessionStorage.getItem('type')) !== 'Branch Head' ?
								code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
							: 	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
							: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

						:	''

			}).reduce((a:any , b:any)=>{

				let st = b.markUp 
			
				return st += a
			}, 0)
			
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}
@Pipe({
	name: 'searchByDate'
  })
  export class SearchByDatePipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any, code? : any): any {
		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"


			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.createdDate).format("YYYY-MM-DD") + "00:00:00"
				
				return atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
						code.value === null && start === undefined && end === undefined ? code.value === null && start === undefined && end === undefined
					:  	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				: atob(sessionStorage.getItem('type')) !== 'Admin' || atob(sessionStorage.getItem('type')) !== 'Branch Head' ?
						code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
					: 	code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
					: 	x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 

				:	''
				// return   code.value === null && start === undefined && end === undefined ? x.branchCode === atob(sessionStorage.getItem('code')) 
				// 	   : code.value === null && start !== undefined && end !== undefined ? fdate >= sdate && fdate <= edate 
				// 	   :  x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate 


			})

			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}
@Pipe({
	name: 'searchByWalletHistoryDate'
  })
  export class SearchByDateWalletHistoryPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {
		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"


			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00"
				
				/**return the data for branches in overall wallet monitoring  */
				return  atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
							start === undefined && end === undefined  ? x
							: fdate >= sdate && fdate <= edate 
							
						: atob(sessionStorage.getItem('type')) !== 'Admin' && atob(sessionStorage.getItem('type')) !== 'Branch Head' ? 
							start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode ? start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode 
							: atob(sessionStorage.getItem('code')) === x.branchCode ? fdate >= sdate && fdate <= edate 
							:''
						: ''
				 


			})

			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}

@Pipe({
	name: 'totalCollectionWalletHistory'
  })
  export class TotalCollectionWalletHistory implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {

		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			
			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00"

				return  atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
							start === undefined && end === undefined  ? x
							: fdate >= sdate && fdate <= edate 
							
						: atob(sessionStorage.getItem('type')) !== 'Admin' && atob(sessionStorage.getItem('type')) !== 'Branch Head' ? 
							start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode ? start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode 
							: atob(sessionStorage.getItem('code')) === x.branchCode ? fdate >= sdate && fdate <= edate 
							:''
						: ''

			}).reduce((a:any , b:any)=>{
				let st = b.collection 
			
				return st += a
			}, 0)
			
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}
@Pipe({
	name: 'totalCollectionWalletHistory'
  })
  export class TotalCollectioWalletHistory implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {

		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			
			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00"

				return   start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode ? start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode 
					   : atob(sessionStorage.getItem('code')) === x.branchCode ? fdate >= sdate && fdate <= edate 
					   :''

			}).reduce((a:any , b:any)=>{
				let st = b.collection 
			
				return st += a
			}, 0)
			
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}
@Pipe({
	name: 'totalSalesWalletHistory'
  })
  export class TotalSalesWalletHistoryPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {

		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			
			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00"

				return  atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
							start === undefined && end === undefined  ? x
							: fdate >= sdate && fdate <= edate 
							
						: atob(sessionStorage.getItem('type')) !== 'Admin' && atob(sessionStorage.getItem('type')) !== 'Branch Head' ? 
							start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode ? start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode 
							: atob(sessionStorage.getItem('code')) === x.branchCode ? fdate >= sdate && fdate <= edate 
							:''
						: ''

			}).reduce((a:any , b:any)=>{
				let st = b.sales 
			
				return st += a
			}, 0)
			
			return payload
						
		}catch(e){
			return undefined
		}
	  
	}

}

@Pipe({
	name: 'totalIncomeWalletHistory'
  })
  export class TotalIncomeWalletHistoryPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {

		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			
			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00"

				return  atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
							start === undefined && end === undefined  ? x
							: fdate >= sdate && fdate <= edate 
							
						: atob(sessionStorage.getItem('type')) !== 'Admin' && atob(sessionStorage.getItem('type')) !== 'Branch Head' ? 
							start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode ? start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.branchCode 
							: atob(sessionStorage.getItem('code')) === x.branchCode ? fdate >= sdate && fdate <= edate 
							:''
						: ''

			}).reduce((a:any , b:any)=>{
				let st = b.income 
			
				return st += a
			}, 0)
			
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}

@Pipe({
	name: 'searchByCommissionDate'
  })
  export class SearchByCommissionPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {
		
		try{
			
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"


			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00"
				
				/**return the data for branches in overall wallet monitoring  */
				return  atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
							start === undefined && end === undefined  ? x
							: fdate >= sdate && fdate <= edate 
							
						: atob(sessionStorage.getItem('type')) !== 'Admin' && atob(sessionStorage.getItem('type')) !== 'Branch Head' ? 
							start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.franchise ? start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.franchise 
							: atob(sessionStorage.getItem('code')) === x.franchise ? fdate >= sdate && fdate <= edate 
							:''
						: ''
				 


			})

			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}

@Pipe({
	name: 'totalIncomeCommission'
  })
  export class TotalIncomeCommissionPipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {

		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"
			
			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.date_transacted).format("YYYY-MM-DD") + "00:00:00"

				return  atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? 
							start === undefined && end === undefined  ? x
							: fdate >= sdate && fdate <= edate 
							
						: atob(sessionStorage.getItem('type')) !== 'Admin' && atob(sessionStorage.getItem('type')) !== 'Branch Head' ? 
							start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.franchise ? start === undefined && end === undefined && atob(sessionStorage.getItem('code')) === x.franchise 
							: atob(sessionStorage.getItem('code')) === x.franchise ? fdate >= sdate && fdate <= edate 
							:''
						: ''

			}).reduce((a:any , b:any)=>{
				
				let st = parseInt(b.income )
			
				return st += a
			}, 0)
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}