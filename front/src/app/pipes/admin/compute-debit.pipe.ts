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
				
				return `${x.transacted_by} ${x.branchCode}` === `${code.value.transacted_by} ${code.value.branchCode}` && fdate >= sdate && fdate <= edate
						
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
				
				return `${x.transacted_by} ${x.branchCode}` === `${code.value.transacted_by} ${code.value.branchCode}` && fdate >= sdate && fdate <= edate
						
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
				
				return `${x.transacted_by} ${x.branchCode}` === `${code.value.transacted_by} ${code.value.branchCode}` && fdate >= sdate && fdate <= edate
						
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
				
				return x.tellerCode === code.value.tellerCode && fdate >= sdate && fdate <= edate

			})
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}
