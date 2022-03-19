import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoadcentralService } from 'src/app/api/loadcentral/shared/services/loadcentral.service';
import { SearchByDatePipe } from 'src/app/pipes/admin/compute-debit.pipe';
import { BranchService } from 'src/app/services/branch.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { LcExcelService } from './lc-excel.service';

	@Component({
	selector: 'app-load-central-history',
	templateUrl: './load-central-history.component.html',
	styleUrls: ['./load-central-history.component.scss']
	})
export class LoadCentralHistoryComponent implements OnInit {

	displayedColumns : any = ['no', 'reference_id', 'TransId', 'mobileNo', 'productCode', 'amount', 'markUp', 'ePIN', 'createdBy', 'createdDate', 'status']
	dataSource: any;
	start:any
	end : any
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	dataFilter: any;
	tellerList: any;
	searchControl = new FormControl();
	filteredOptions: Observable<any[]>
	@ViewChild("printMe") printTheDiv!: ElementRef
	constructor(private http_load : LoadcentralService,
				private http_branch : BranchService,
				private _snackBar : SnackbarServices,
				private pipeData : SearchByDatePipe,
				private http_excel : LcExcelService) { }

	ngOnInit() {
		this.loadCentralHistory()
		this.getTellerlist()
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
	
	async loadCentralHistory(){
		const result : any = await this.http_load.getLoadCentralTransactions()
		
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			this.dataSource = new MatTableDataSource<any>(result)
			this.dataSource.paginator = this.paginator
		}else{
			/**
			 * franchise and ibarangay data
			 */
			const data = result.filter((x:any)=>{ return x.branchCode === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)
			this.dataSource = new MatTableDataSource<any>(data)
			this.dataSource.paginator = this.paginator 
			this.dataFilter = data
		}
		
	}

	async getTellerlist(){
		try{
			const result : any = await this.http_branch.getTellerlist()
			
			const data = result.filter((x:any)=>{
				
				return    x.tellerCode.slice(0,3) === 'FRT' && x.fiB_Code === atob(sessionStorage.getItem('code')) ? x.tellerCode
						: x.tellerCode.slice(0,3) === 'BRT' && x.ibrgy_code === atob(sessionStorage.getItem('code')) ? x.tellerCode 
						: '' 
				
			}).map((y:any)=>y)
			this.tellerList = data
		}catch(err){
			this._snackBar._showSnack('Failed to Fetch', 'error')
		}
	}

	exportAsExcel(){
		
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			alert('buhaton pani ')
		}else{
			const result = this.pipeData.transform(this.dataSource, this.start, this.end, this.searchControl)
			this.http_excel.exportAsExcelFile(result)
		}
	}

	print(){
		this.printTheDiv.nativeElement.click()
    }

}
