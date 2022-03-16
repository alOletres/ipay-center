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