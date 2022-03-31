import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit {
	dataSource: any;
	start :any
	end : any
	displayedColumns :any = ['no', 'ibarangay', 'teller', 'income', 'transaction_id', 'status', 'date_transacted']
	@ViewChild("printMe") printTheDiv!: ElementRef
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator
	fullname: string;
	email: any;
	contactNo: any;
	branchName: any;
	address: any;
	constructor(private http_dash : DashboardService) { }

	ngOnInit(){
		this.commission()
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
	}

	async commission(){
		const result :any = await this.http_dash.commission()
		
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){ 
			this.dataSource = new MatTableDataSource<any>(result)
			this.dataSource.paginator = this.paginator
		}else{

			const data :any = result.filter((x:any)=>{ return x.franchise === atob(sessionStorage.getItem('code')) }).map((y:any)=>y)
			this.dataSource = new MatTableDataSource<any>(data)
			this.dataSource.paginator = this.paginator
		}
	}
	print(){
		this.printTheDiv.nativeElement.click()
    }

}
