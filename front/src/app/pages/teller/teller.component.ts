import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BranchService } from 'src/app/services/branch.service';
import { ResetformService } from 'src/app/services/resetform.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import SocketService from 'src/app/services/socket.service';

  @Component({
    selector: 'app-teller',
    templateUrl: './teller.component.html',
    styleUrls: ['./teller.component.scss']
  })
  export class TellerComponent implements OnInit {

	@ViewChild('tellerDialog') tellerDialog : TemplateRef<any>

	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
	@Input() item ="" 
	dataSource : any
	displayedColumns: string[] = ['no', 'teller_name', 'code', 'type',  'status', 'action'];
	tellerForm : FormGroup
	btnName: string;
	type: string;
	tellerData: number;
	progress : boolean =false
    constructor(private http_branch : BranchService, private _snackBar : SnackbarServices, 
				private dialog : MatDialog, private fb : FormBuilder, private resetForm : ResetformService,
				private socketService : SocketService ) {
		this.tellerForm = this.fb.group({
			firstname : new FormControl('', 			[Validators.required]),
			lastname  : new FormControl('', 			[Validators.required]),
			contactNo : new FormControl('', 			[Validators.required]),
			email 	  : new FormControl('', 			[Validators.required, Validators.email]),
			locationAddress	  : new FormControl('', 	[Validators.required])
		})
		this.btnName = "Save"
		this.socketService.eventListener("response_teller").subscribe(()=> { this.ngOnInit() })
	}

    async ngOnInit() {
		await this.getTellerlist()
		this.type = atob(sessionStorage.getItem('type'))
    }

	async getTellerlist(){

		try{
			this.progress = true
			
			const res = await this.http_branch.getTellerlist()

			if( atob(sessionStorage.getItem('type')) === 'Admin' ){

				const r = Object.values(res)
				let x = r.map((x)=>x)
				
				this.tellerData = r.length
				this.dataSource = x
				this.dataSource = new MatTableDataSource<any>(x)
				this.dataSource.paginator = this.paginator

				this.progress =false

			}else if(atob(sessionStorage.getItem('type')) === 'Branch Head'){
				
				const data = Object.values(res).filter((x:any)=>{ return x.branchCode === atob(sessionStorage.getItem('code')) }).map((r:any)=>r)
				
				this.tellerData = data.length
				this.dataSource = new MatTableDataSource<any>(data)
				this.dataSource.paginator = this.paginator
				this.progress = false
			}else if(atob(sessionStorage.getItem('type')) === 'Franchise'){
				
				const data = Object.values(res).filter((x:any)=>{ 
					return x.fiB_Code === atob(sessionStorage.getItem('code')) && x.tellerCode.slice(0,3) === 'FRT' 
				}).map((r:any)=>r)
				this.tellerData = data.length
				this.dataSource = new MatTableDataSource<any>(data)
				this.dataSource.paginator = this.paginator
				this.progress = false

			}else{
				const data = Object.values(res).filter((x:any)=>{ 
					return x.ibrgy_code === atob(sessionStorage.getItem('code')) && x.tellerCode.slice(0,3) === 'BRT'
				}).map((r:any)=>r)
				this.tellerData = data.length
				this.dataSource = new MatTableDataSource<any>(data)
				this.dataSource.paginator = this.paginator
				this.progress = false
			}

		}catch(e){
			this._snackBar._showSnack('Failed to Fetch', 'error')
			this.progress = false
		}
	}
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	async slideStatus(data:any, type:any){

		this.progress = true
		await this.http_branch.updateStatusTeller({
			data: data,
			approved_by : `${atob(sessionStorage.getItem('code'))} ${atob(sessionStorage.getItem('type'))}`
		}).then(()=>{
			this.progress = false
			this._snackBar._showSnack('Successfully change', 'success')
			this.ngOnInit()
		}).catch(error=>{
			this.progress = false
			this._snackBar._showSnack(error, 'error')
		})

	}
	editTeller(data:any){

		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head' ){
			this.dialog.open(this.tellerDialog,{ 
				width : '500px',
				panelClass: 'myClass' ,
				disableClose : true
			})
			this.btnName = "Save Changes"
			this.tellerForm = this.fb.group({
				firstname : new FormControl(data.firstname, [Validators.required]),
				lastname  : new FormControl(data.lastname, 	[Validators.required]),
				contactNo : new FormControl(data.contactNo, [Validators.required]),
				email 	  : new FormControl(data.email, 	[Validators.required, Validators.email]),
				locationAddress	  : new FormControl(data.location, 	[Validators.required]),
				id : data.id
			})
		}else{
			this.btnName = "Save Changes"
			this.tellerForm = this.fb.group({
				firstname : new FormControl(data.firstname, [Validators.required]),
				lastname  : new FormControl(data.lastname, 	[Validators.required]),
				contactNo : new FormControl(data.contactNo, [Validators.required]),
				email 	  : new FormControl(data.email, 	[Validators.required, Validators.email]),
				locationAddress	  : new FormControl(data.location, 	[Validators.required]),
				id : data.id
			})
		}
	}
	async tellerChanges(){
		this.progress = true

		if(this.btnName === 'Save'){

			(atob(sessionStorage.getItem('type') ) === 'Franchise' )
			? await this.http_branch.addibTeller({data : this.tellerForm.value , fcode : atob(sessionStorage.getItem('code'))})
				.then((response : any)=>{

					(JSON.parse(response).message) 
					? `${this._snackBar._showSnack("Successfully Save", 'success')} ${this.ngOnInit()} ${this.resetForm.reset(this.tellerForm)} ${this.progress = false} `
					: `${this._snackBar._showSnack('Try Again', 'error')} ${this.progress = false}`
					
				}).catch((err)=>{	
					this.progress = false
					this._snackBar._showSnack(err, 'error')
				})
			: await this.http_branch.addIbarangayTeller({ data : this.tellerForm.value, ibCode : atob(sessionStorage.getItem('code')) })
				.then((response:any)=>{
					if(JSON.parse(response).message === 'ok'){
						this.progress = false
						this._snackBar._showSnack('Successfully Save', 'success')
						this.ngOnInit()
						this.resetForm.reset(this.tellerForm)
					}else{
						this.progress = false
						this._snackBar._showSnack('Try Again', 'error')
					}		
				}).catch((err)=>{
					this.progress = false
					this._snackBar._showSnack(err, 'error')
				})
		}else{

			await this.http_branch.updateTeller_list(this.tellerForm.value)
		
			.then((response:any)=>{
				(response === 'success Updates.')
				? `${this._snackBar._showSnack(response, 'success')} ${this.ngOnInit()} ${this.resetForm.reset(this.tellerForm)} ${this.progress =false}`
				:  `${this._snackBar._showSnack('Try Again', 'error')} ${this.progress = false}`
				
			}).catch((err)=>{
				this.progress = false
				this._snackBar._showSnack(err, 'error')
			})

		}

	}

	reset(){
		this.resetForm.reset(this.tellerForm)
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

}
