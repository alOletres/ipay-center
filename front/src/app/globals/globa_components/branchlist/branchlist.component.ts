import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { branch } from "../../../globals/interface/branch.interface";

import { BranchService } from "./../../../services/branch.service";
import { ReceivablesService } from "./../../../services/receivables.service";
import { SnackbarServices } from './../../../services/snackbar.service';
import { AuthenticationService } from './../../../services/authentication.service'
import { AddbranchComponent } from "./../../globa_components/addbranch/addbranch.component";
import { MatDialog } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from './../../../components/stepper/stepper.component';
import SocketService from 'src/app/services/socket.service';
@Component({
	selector: 'app-branchlist',
	templateUrl: './branchlist.component.html',
	styleUrls: ['./branchlist.component.scss']
})
export class BranchlistComponent implements OnInit {


	types :any
	branchCode :any
	dialogata : any
	dialogalue: any
	displayedColumns: string[] = ['no', 'name', 'branch code', 'branch name', 'branch type', 'status', 'action'];
	dataSource: MatTableDataSource<branch>;
	
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

	constructor(
		private _snackBar: SnackbarServices,
		private httpBranch: BranchService,
		private _recieved: ReceivablesService,
		public dialog: MatDialog,
		private fb: FormBuilder,
		private http_auth : AuthenticationService,
		private router : Router,
		private socketService : SocketService
	) { 


	}

	async ngOnInit() {
		
		this.types = atob(sessionStorage.getItem('type'))
		try {
			if(atob(sessionStorage.getItem('type')) === 'Branch Head') {
				const dataResult: any = await this.http_auth.getUser({type: atob(sessionStorage.getItem('type')), type_code: atob(sessionStorage.getItem('code'))});
				this.dataSource = new MatTableDataSource<branch>(dataResult);
				this.dataSource.paginator = this.paginator
				this._recieved.getObj(dataResult)
				
			}else{
				const dataResult: any = await this.httpBranch.getBranchList()
				this.dataSource = new MatTableDataSource<branch>(dataResult);
				this.dataSource.paginator = this.paginator
			}
		} catch (e) {
			console.log(e);
		}
	}
	applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	editBranch(element: any) : void {
		const dialogRef = this.dialog.open(AddbranchComponent, {
			width: '500px',
			disableClose : true,
			
			data: {
				ownerFirstname: element.ownerFirstname, 
				ownerLastname: element.ownerLastname,
				contactNo : element.contactNo,
				emailAdd : element.emailAdd,
				address : element.address,
				branchName : element.branchName,
				branchType : element.branchType,
				b_id: element.b_id,
				btnName : 'Update Branch'
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
		})
	}
	slideStatus(dataStat: any) {
		try{
			this.httpBranch.updateBranchStatus({ 
				data : dataStat,
				loggedBy : atob(sessionStorage.getItem('type'))
			}).then((response:any)=>{
				if(response === 'success Updates.'){
					this._snackBar._showSnack(`Branch Status Sucessfully Updated`, 'success')
					this.ngOnInit()
				}else{
					this._snackBar._showSnack("Try Again", 'error')
				}
			}).catch(err=>{
				this._snackBar._showSnack(err, 'error')
			})
		}catch(err:any){
			this._snackBar._showSnack('Something went wrong! Please contact tech support.', 'error')
		}
	}
	addFranchise(branchCode:any){
		const dialogRef = this.dialog.open(StepperComponent, {
			width: '800px',
			disableClose : true,
			data:{
				branchCode : branchCode,
				disable : 'true',
				branch : 'Franchise'
			}
		});
		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
		})
	}
	addBranch(){
		const dialogRef = this.dialog.open(AddbranchComponent,{
			width: '500px',
			disableClose : true,
			data: {
				btnName : 'Save'
			}
		})
		dialogRef.afterClosed().subscribe(result=>{
			this.ngOnInit()
		})
	}
}
