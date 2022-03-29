import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SearchByDateMultisysPipe } from 'src/app/pipes/admin/compute-debit.pipe';
import { BranchService } from 'src/app/services/branch.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { GovbillpaymentService } from './govbillpayment.service';

@Component({
  selector: 'app-govbillpayment',
  templateUrl: './govbillpayment.component.html',
  styleUrls: ['./govbillpayment.component.scss']
})
export class GovbillpaymentComponent implements OnInit {
	dataSource: any;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	displayedColumns : any = ['no', 'customer_name', 'account_number', 'amount', 'contact_number', 'refno', 'biller', 'collections', 'sales', 'income', 'status']
	@ViewChild("printMe") printTheDiv!: ElementRef
	fullname: string;
	email: any;
	contactNo: any;
	branchName: any;
	address: any;
	start : any
	end : any
	tellerList: any;
	searchControl = new FormControl();
	filteredOptions: Observable<any[]>
	constructor(private http_gov : GovbillpaymentService,
				private _snackBar : SnackbarServices,
				private http_branch : BranchService,
				private pipeData : SearchByDateMultisysPipe) { }

	ngOnInit() {
		this.govBillPayment()
		this.getTellerlist()
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			/**admin and branch head is here */
		}else{
			const { firstname, lastname, email, contactNo, franchiseName, location } = JSON.parse(atob(sessionStorage.getItem('d')))[0]
			this.fullname = `${firstname} ${lastname}`.toUpperCase()
			this.email = email
			this.contactNo = contactNo
			this.branchName = franchiseName.toUpperCase()
			this.address = location.toUpperCase()
		}
		this.filteredOptions = this.searchControl.valueChanges.pipe(
			startWith(''),
			map(value=>  this._filter(value))
		)
	}
	private _filter(value:any) : any[]{

		try{
			const filterValue = value.toLowerCase()
			return this.tellerList.filter((option:any)=> option.tellerCode.toLowerCase().includes(filterValue) )
		}catch(e){
			return undefined
		}
	}

	displayFn(subject:any){
		return subject ? subject.tellerCode : undefined
	}
	async govBillPayment(){
		try{
			const result :any = await this.http_gov.multisys()
			const data:any = result.filter((x:any)=>{ 
				return x.branchCode === atob(sessionStorage.getItem('code')) ? x.branchCode === atob(sessionStorage.getItem('code')) 
					  : atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ? x 
					  : ''
				})
				this.dataSource = new MatTableDataSource<any>( data)// display for log user franchise
				this.dataSource.paginator = this.paginator
			
		}catch(err:any){
			this._snackBar._showSnack('Failed to Fetch', 'error')
		}
	}
	async getTellerlist(){
		try{
			const result : any = await this.http_branch.getTellerlist()

			if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
				this.tellerList = result
			
				
			}else{
				/**for branches tellers  */
				const data = result.filter((x:any)=>{
				
					return    x.tellerCode.slice(0,3) === 'FRT' && x.fiB_Code === atob(sessionStorage.getItem('code')) ? x.tellerCode
							: x.tellerCode.slice(0,3) === 'BRT' && x.ibrgy_code === atob(sessionStorage.getItem('code')) ? x.tellerCode 
							: '' 
					
				}).map((y:any)=>y)
				this.tellerList = data
			}
			
			
		}catch(err){
			this._snackBar._showSnack('Failed to Fetch', 'error')
		}
	}
	print(){
		this.printTheDiv.nativeElement.click()
	}
	exportAsExcel(){
		const result :any = this.pipeData.transform(this.dataSource, this.start, this.end, this.searchControl)
		this.http_gov.exportAsExcelFile(result)
	}
}
