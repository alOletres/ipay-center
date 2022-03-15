import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewdialogComponent } from 'src/app/globals/globa_components/viewdialog/viewdialog.component';
import { BranchService } from 'src/app/services/branch.service';
import { ResetformService } from 'src/app/services/resetform.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import SocketService from 'src/app/services/socket.service';


@Component({
selector: 'app-ibarangay',
templateUrl: './ibarangay.component.html',
styleUrls: ['./ibarangay.component.scss']
})
export class IbarangayComponent implements OnInit {

	@Input() item ="" 
	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
	@ViewChild('ibarangayDialog') ibarangayDialog : TemplateRef<any>
	dataSource: any;
	ibarangayForm : FormGroup
	displayedColumns: string[] = ['no', 'owner_name', 'code', 'branchName', 'branchType',  'status', 'action'];
	type: string;
	btnName : any = "Save"
	dataIbarangay: number;
	
	constructor( private http_branch : BranchService,
				 private _snackBar : SnackbarServices,
				 private dialog : MatDialog,
				 private resetForm : ResetformService,
				 private socketService : SocketService ) {

		this.socketService.eventListener("response_addiBarangay").subscribe(()=> { this.ngOnInit() })
		
		this.ibarangayForm = new FormBuilder().group({
			firstname 		: new FormControl('', 	  [Validators.required]),
			lastname 		: new FormControl('', 	  [Validators.required]),
			contactNo 		: new FormControl('', 	  [Validators.required]),
			email 			: new FormControl('', 	  [Validators.required, Validators.email]),
			locationAddress : new FormControl('',	  [Validators.required]),
			branchName  	: new FormControl('', 	  [Validators.required]),
		})

		this.btnName = "Save"
	}

	async ngOnInit() {
		await this.ibarangay()
		this.type = atob(sessionStorage.getItem('type'))
		
	}

	async ibarangay(){
		try{
			
			const res =  await this.http_branch.getIbarangaylist()
			
			if(atob(sessionStorage.getItem('type')) === 'Admin'){
				const x = Object.values(res)
				let y = x.map((r:any)=>r)

				this.dataSource = new MatTableDataSource<any>(y)
				this.dataSource.paginator = this.paginator
				this.dataIbarangay = x.length

			}else if(atob(sessionStorage.getItem('type')) === 'Branch Head'){

				let data = Object.values(res).filter((z:any)=>{ return z.branchCode === atob(sessionStorage.getItem('code')) }).map((res:any)=>res)				
				
				this.dataIbarangay = data.length
				this.dataSource = new MatTableDataSource<any>(data)
				this.dataSource.paginator = this.paginator
				
			}else{
				
				let data = Object.values(res).filter((z:any)=>{ return z.ib_fbranchCode === atob(sessionStorage.getItem('code')) }).map((res:any)=>res)				
				this.dataSource = new MatTableDataSource<any>(data)
				this.dataSource.paginator = this.paginator
				this.dataIbarangay = data.length
			}

		}catch(err){
			this._snackBar._showSnack("Failed to Fetch", 'error')
		}
	}
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	async slideStatus(data:any, type:any){
		
		await this.http_branch.updateStatusIb({
			
			data:data,
			approved_by : `${atob(sessionStorage.getItem('code'))} ${atob(sessionStorage.getItem('type'))}`
		
		}).then(()=>{
			this._snackBar._showSnack(`Branch Status Sucessfully Updated`, 'success')
			this.ngOnInit()

		}).catch(error=>{
			this._snackBar._showSnack(error, 'error')
		})
	}

	function_viewdialogTeller(data : any){
		
		this.dialog.open(ViewdialogComponent, {
			width : '1000px',
			disableClose : true,
			data : {
				fbranchCode : data.fbranchCode,
				ib_code : data.ib_ibrgyyCode,
				type : 'Teller'
			}
		})

	}
	openDialog(data:any){
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			this.dialog.open(this.ibarangayDialog,{
				width : '500px',
				disableClose : true,
				panelClass: 'myClass' 
			})
			this.btnName = "Save Changes"
			this.ibarangayForm = new FormBuilder().group({
				firstname 		: new FormControl(data.firstname, 	  [Validators.required]),
				lastname 		: new FormControl(data.lastname, 	  [Validators.required]),
				contactNo 		: new FormControl(data.contactNo, 	  [Validators.required]),
				email 			: new FormControl(data.email, 	   	  [Validators.required, Validators.email]),
				locationAddress : new FormControl(data.location,	  [Validators.required]),
				branchName  	: new FormControl(data.franchiseName, [Validators.required]),
				ib_id : data.ib_id
			})
		}else{
			this.btnName = "Save Changes"
			this.ibarangayForm = new FormBuilder().group({
				firstname 		: new FormControl(data.firstname, 	  [Validators.required]),
				lastname 		: new FormControl(data.lastname, 	  [Validators.required]),
				contactNo 		: new FormControl(data.contactNo, 	  [Validators.required]),
				email 			: new FormControl(data.email, 	   	  [Validators.required, Validators.email]),
				locationAddress : new FormControl(data.location,	  [Validators.required]),
				branchName  	: new FormControl(data.franchiseName, [Validators.required]),
				ib_id : data.ib_id
			})
		}
	
		
		
	}
	async ibarangayChanges(){

		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){
			await this.http_branch.updateIbarangaylist({data : this.ibarangayForm.value})
			.then((response:any)=>{
				(JSON.parse(response).message === 'ok')?
					`${this._snackBar._showSnack('Successfully Change', 'success')} ${this.ngOnInit()} ${this.resetForm.reset(this.ibarangayForm)}
					
					${this.socketService.sendEvent("eventSent", {data: "response_addiBarangay"})/**SOCKET SEND EVENT */}`

				: this._snackBar._showSnack('Try Again', 'error')
			}).catch(err=>{
				this._snackBar._showSnack(err, 'error')
			})
		}else{
			(this.btnName === 'Save')? 

				await this.http_branch.saveiB({ data : this.ibarangayForm.value, fcode : atob(sessionStorage.getItem('code'))})
				.then((response:any)=>{
					(JSON.parse(response).message === 'ok')
					? `${this._snackBar._showSnack('Successfully Save', 'success')} ${this.ngOnInit()} ${this.resetForm.reset(this.ibarangayForm)}
					
						${this.socketService.sendEvent("eventSent", {data: "response_addiBarangay"})/**SOCKET SEND EVENT */}`
					
					:  this._snackBar._showSnack('Try Again', 'error')
				}).catch(err=>{
					this._snackBar._showSnack(err, 'error')
				})
				
			: await this.http_branch.updateIbarangaylist({data : this.ibarangayForm.value})
			.then((response:any)=>{
				(JSON.parse(response).message === 'ok')?
				
					`${this._snackBar._showSnack('Successfully Change', 'success')} ${this.ngOnInit()} ${this.resetForm.reset(this.ibarangayForm)}
					 ${this.socketService.sendEvent("eventSent", {data: "response_addiBarangay"})/**SOCKET SEND EVENT */}`

				: this._snackBar._showSnack('Try Again', 'error')
			}).catch(err=>{
				this._snackBar._showSnack(err, 'error')
			})
		}
	}
	validateOnlyNumbers(evt: any) {
		var theEvent = evt || window.event;
		var key = theEvent.keyCode || theEvent.which;
		key = String.fromCharCode( key );
		var regex = /[0-9]|\./;
		if( !regex.test(key) ) {
		  	theEvent.returnValue = false;
		  	if(theEvent.preventDefault) theEvent.preventDefault();
		}
	}

	reset(){
		this.resetForm.reset(this.ibarangayForm)
	}

	

}
