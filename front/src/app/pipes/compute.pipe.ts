import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
@Pipe({
  name: 'compute'
})
export class ComputePipe implements PipeTransform {

  transform(collection : any, franchise_charge?: any,  ipayCharge? : any): any {

    return  parseInt(collection) + franchise_charge + ipayCharge
    

  }


}

@Pipe({
  name: 'computeSales'
})
export class ComputeSalesPipe implements PipeTransform {

  transform(sales : any,  ipayCharge? : any): any {
    
    return  parseInt(sales) + ipayCharge

  }


}

@Pipe({
  name: 'computeCollection'
})
export class ComputeCollectionPipe implements PipeTransform {
  
  transform(data : any, start? : any, end? : any): any {

	try{
		const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
		const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"

		let total = data.filteredData.filter((x:any)=>{
      
			const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"

				return x.transacted_by === atob(sessionStorage.getItem('code')) && fdate >= sdate && fdate <= edate
					
		}).reduce((a: number, b: any) =>  {
			
			let st = (b.franchise_charge + (b.ipayService_charge + parseInt(b.ticket_totalPrice)))
			
			return st += a
			
		}, 0)

		
		return total 

	}catch(e){
		return undefined
	}

  }


}

@Pipe({
	name: 'computeTotalSales'
  })
  export class ComputeSalePipe implements PipeTransform {
	
	transform(data : any, start? : any, end? : any): any {

		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"

			let total = data.filteredData.filter((x:any)=>{
		
				const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"

				return x.transacted_by === atob(sessionStorage.getItem('code')) && fdate >= sdate && fdate <= edate
						
			}).reduce((a: number, b: any) =>  {
				
				let st = b.ipayService_charge + parseInt(b.ticket_totalPrice)
				
				return st += a
				
			}, 0)
			
			return total 
		}catch(e){
			return undefined
		}
	  
	}
  
  }

  @Pipe({
	name: 'computeIncome'
  })
  export class ComputeIncomePipe implements PipeTransform {
	
	transform(data : any, start? : any, end? : any): any {
		
		try{
			
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"

			let total = data.filteredData.filter((x:any)=>{
				  
				const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"

				return x.transacted_by === atob(sessionStorage.getItem('code')) && fdate >= sdate && fdate <= edate
						
			}).reduce((a: number, b: any) =>  {
				
				let st = b.franchise_charge 
			
				return st += a
				
			}, 0)  

		  return total 
		  
		}catch(e){
			return undefined
		}
	  

	}
  
}

  @Pipe({
	name: 'searchByDate'
  })
  export class SearchByDatePipe implements PipeTransform {
	
	transform(data : any ,start? : any, end? : any): any {
		
		try{
			const sdate = moment(start).format("YYYY-MM-DD") + "00:00:00"
			const edate = moment(end).format("YYYY-MM-DD") + "00:00:00"


			const payload = data.filteredData.filter((x: any) => {

				const fdate = moment(x.transacted_date).format("YYYY-MM-DD") + "00:00:00"

				return x.transacted_by === atob(sessionStorage.getItem('code')) && fdate >= sdate && fdate <= edate

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
	
	transform(data : any ): any {
		
		try{
			const payload = data.filteredData.filter((x: any) => {
				return x.amount 

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
	
	transform(data : any ): any {
		
		try{
			const payload = data.filteredData.filter((x: any) => {
				return x.markUp 

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
	name: 'multisysCollectionTotal'
  })
  export class multisysCollectionTotalPipe implements PipeTransform {
	
	transform(data : any ): any {
		
		try{
			const payload = data.filteredData.filter((x: any) => {
				return x.collections 

			}).reduce((a:any , b:any)=>{

				let st = b.collections 
			
				return st += a
			}, 0)
			
			return payload
			
		}catch(e){
			return undefined
		}
	  
	}

}
@Pipe({
	name: 'multisysSalesTotal'
  })
  export class multisysSalesTotalPipe implements PipeTransform {
	
	transform(data : any ): any {
		
		try{
			const payload = data.filteredData.filter((x: any) => {
				return x.sales 

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
	name: 'multisysIncomeTotal'
  })
  export class multisysIncomeTotalPipe implements PipeTransform {
	
	transform(data : any ): any {
		
		try{
			const payload = data.filteredData.filter((x: any) => {
				return x.income 

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