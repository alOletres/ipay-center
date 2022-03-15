import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from "./../../../services/authentication.service"
@Component({
  selector: 'app-viewdialog',
  templateUrl: './viewdialog.component.html',
  styleUrls: ['./viewdialog.component.scss']
})
export class ViewdialogComponent implements OnInit {
	fbranchCode : any
	dataSource : any
	type : any
	ib_code : any
	dataSourceLength : any
	displayedColumns : string [] = ['no', 'name', 'branch code', 'branch name', 'branchType', 'status']
   	constructor(
	private http_auth : AuthenticationService,
    public dialogRef: MatDialogRef<ViewdialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) 
    {

		this.fbranchCode = data.fbranchCode
		this.ib_code = data.ib_code
		this.type = data.type
		
	}

	async ngOnInit() {

		if(this.type === 'Teller' ){
			
			if(this.ib_code === undefined){
				const result :any = await this.http_auth.getTellerlistFr({ fbranchCode : this.fbranchCode})
				this.dataSource = result
				this.dataSourceLength = result.length
				
			}else{
				const result:any =	await this.http_auth.getTellerIbarangay({ib_code : this.ib_code})
				this.dataSource = result
				console.log(this.dataSource);
				this.dataSourceLength = result.length
			}
		}else{

			const result : any = await this.http_auth.getForFranchiseList({ fbranchCode : this.fbranchCode})
			// console.log(result);
			this.dataSource = result
			this.dataSourceLength = result.length

		}
		

	}
	
	closeDialog(){
		this.dialogRef.close();
	}

}
