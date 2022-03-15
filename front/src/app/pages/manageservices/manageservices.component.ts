import { Component, OnInit } from '@angular/core';
import { ServicedialogComponent } from './../../globals/globa_components/servicedialog/servicedialog.component'
import { MatDialog } from '@angular/material/dialog';
@Component({
	selector: 'app-manageservices',
	templateUrl: './manageservices.component.html',
	styleUrls: ['./manageservices.component.scss']
})
export class ManageservicesComponent implements OnInit {
	displayedColumn : string [] = ['no', 'image',  'name', 'charge', 'date_added', 'action']
	constructor( private dialog : MatDialog ) { }

	ngOnInit(){

	}
	function_addServices(){
		const dialogRef = this.dialog.open(ServicedialogComponent, {
			width : '500px',
			// disableClose : true,
			data : {
				
			}
		})
		dialogRef.afterClosed().subscribe(resutl =>{
			this.ngOnInit()
		})
	}
}
