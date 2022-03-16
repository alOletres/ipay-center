import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { BranchService } from "./../../../services/branch.service";
import { Router } from '@angular/router';
import { AuthenticationService } from "./../../../services/authentication.service"
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarServices } from './../../../services/snackbar.service';
import { StepperComponent } from './../../../components/stepper/stepper.component'
import { GlobalDialogComponent } from './../../../components/global-dialog/global-dialog.component'
import { ViewdialogComponent } from './../viewdialog/viewdialog.component'
import SocketService from 'src/app/services/socket.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-franchiselist',
  templateUrl: './franchiselist.component.html',
  styleUrls: ['./franchiselist.component.scss']
})
export class FranchiselistComponent implements OnInit {

	dataSource: MatTableDataSource<any>;
	tellerForm : FormGroup
	displayedColumns: string[] = ['no', 'name', 'branch code', 'branchName', 'branchType',  'status', 'action', 'viewIB', 'viewF'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	@Input() item ="" 
	@ViewChild('addTellerDialog') addTellerDialog : TemplateRef<any>
	types:any
	branchCode: any;
	fbranchCode: any;
	constructor(
		private httpFbranch : BranchService,
		public dialog: MatDialog,
		private _snackBar: SnackbarServices, 
		private http_auth : AuthenticationService,
		private router : Router,
		private socketService : SocketService
	) {
		this.socketService.eventListener("response_addFranchise").subscribe(()=> { this.ngOnInit() })

		this.tellerForm = new FormBuilder().group({
			firstname : new FormControl('', [Validators.required]),
			lastname : new FormControl('', [Validators.required]),
			contactNo : new FormControl('', [Validators.required]),
			email : new FormControl('', [Validators.required, Validators.email]),
			locationAddress : new FormControl('', [Validators.required])
		})
	}																										

	async ngOnInit() {
		await this.franchisee()
		this.types = atob(sessionStorage.getItem('type'))
		
	}
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	editFranchise(data:any){	
		if(data.franchiseName === null){
			const dialogRef = this.dialog.open(GlobalDialogComponent, {
				width: '500px',
				disableClose : true,
				data:{
					branchCode : data.branchCode,
					fbranchCode : data.fbranchCode,
					franchiseName : 'al',
					fbranchType : data.fbranchType,
					firstname : data.firstname,
					lastname : data.lastname,
					contactNo : data.contactNo,
					email : data.email,
					location : data.location,
					id : data.id,
					ib_id : data.ib_id,
					item : this.item,
					btnName : 'Save Changes'
				}
			})
			dialogRef.afterClosed().subscribe(result=>{
				this.ngOnInit()
			})
		}else{
			const dialogRef = this.dialog.open(GlobalDialogComponent, {
				width: '500px',
				disableClose : true,
				data:{
					branchCode : data.branchCode,
					fbranchCode : data.fbranchCode,
					franchiseName : data.franchiseName,
					fbranchType : data.fbranchType,
					firstname : data.firstname,
					lastname : data.lastname,
					contactNo : data.contactNo,
					email : data.email,
					location : data.location,
					id : data.id,
					ib_id : data.ib_id,
					item : this.item,
					btnName : 'Save Changes'
				}
			})
			dialogRef.afterClosed().subscribe(result=>{
				this.ngOnInit()
			})
		}
	}
	async slideStatus(data:any, stat:any){
		
		try{
			if(stat === 'Teller'){
				await this.httpFbranch.updateStatusTeller({
					
					data: data,
					approved_by : `${atob(sessionStorage.getItem('code'))} ${atob(sessionStorage.getItem('type'))}`

				}).then(response=>{
					this._snackBar._showSnack(`Branch Status Sucessfully Updated`, 'success')
					this.ngOnInit()
				}).catch(error=>{
					this._snackBar._showSnack('Internal Error', 'error')
				})

			}else{
				if(stat == 'Franchise'){
					await this.httpFbranch.updateFbranchStatus({
						data : data,
						approved_by : `${atob(sessionStorage.getItem('code'))} ${atob(sessionStorage.getItem('type'))}`
					}).then(response=>{

						this._snackBar._showSnack(`Branch Status Sucessfully Updated`, 'success')
						this.ngOnInit()
					
					}).catch(error=>{
						this._snackBar._showSnack('Internal Error', 'error')
					})
				}else{
					await this.httpFbranch.updateStatusIb({
						data:data,
						approved_by : `${atob(sessionStorage.getItem('code'))} ${atob(sessionStorage.getItem('type'))}`
					}).then(response=>{
						this._snackBar._showSnack(`Branch Status Sucessfully Updated`, 'success')
						this.ngOnInit()
					}).catch(error=>{
						this._snackBar._showSnack('Internal Error', 'error')
					})
				}
			}
		}catch(e){
			this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')
		}
	}
	addiBaranggay(...data:any){
		
		const dialogRef = this.dialog.open(StepperComponent, {
			width: '800px',
			disableClose : true,
			data:{
				branchCode : data[0],
				fbranchCode : data[1],
				branch : 'iBarangay'
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
		})
	}
	addTeller(data:any){

		this.dialog.open(this.addTellerDialog, {
			width : '500px',
			disableClose : true,
			panelClass : 'myClass'
		})

		this.branchCode = data.branchCode
		this.fbranchCode = data.fbranchCode
	}
	async saveTeller(){

		await this.httpFbranch.addibTeller({
			data : this.tellerForm.value,
			fcode : this.fbranchCode
		}).then((response:any)=>{
			if(JSON.parse(response).message === 'ok'){
				this._snackBar._showSnack('Successfully Save', 'success')
				this.socketService.sendEvent("eventSent", {data: "response_teller"})/**SOCKET SEND EVENT */
			}else{
				this._snackBar._showSnack('Try Again', 'error')
			}
		}).catch((err)=>{
			this._snackBar._showSnack(err, 'error')
		})
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
	globalpaginator(data:any){
		this.dataSource = new MatTableDataSource<any>(data)// display for log user franchise 
		this.dataSource.paginator = this.paginator
	}
	addiBarangayForFranc(data:any){
		const dialogRef =	this.dialog.open(GlobalDialogComponent, {
			width: '800px',
			disableClose : true,
			data :{
				branchCode : data.branchCode,
				fbranchCode : data.fbranchCode,
				item : 'iBarangay',
				btnName : 'Save_'
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
		})
	}

	async function_franchiseiBarangay(data: any){

		const dialogRef = this.dialog.open(ViewdialogComponent, {
			width : '1000px',
			disableClose : true,
			data : {
				fbranchCode : data.fbranchCode,
				type : 'iBarangay'
			}
		})

	}

	function_viewdialogTeller(data : any){
		
		const dialogRef = this.dialog.open(ViewdialogComponent, {
			width : '1000px',
			disableClose : true,
			data : {
				fbranchCode : data.fbranchCode,
				ib_code : data.ib_ibrgyyCode,
				type : 'Teller'
			}
		})

	}

	async franchisee(){	
		
		if(atob(sessionStorage.getItem('type')) === 'Admin'){
			const result = await this.httpFbranch.getFranchlist()
			const res = Object.values(result)
			let x = res.map((x:any)=>x)
			this.globalpaginator(x)

		}else if(atob(sessionStorage.getItem('type')) === 'Branch Head') {

			const result = await this.httpFbranch.getFranchlist()

			const data = Object.values(result).filter((x:any)=>{
				return x.branchCode === atob(sessionStorage.getItem('code'))
			}).map((y:any)=>y)
			this.globalpaginator(data)
		}
	}
}

