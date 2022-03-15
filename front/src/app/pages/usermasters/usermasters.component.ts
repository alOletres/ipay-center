import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";


@Component({
	selector: 'app-usermasters',
	templateUrl: './usermasters.component.html',
	styleUrls: ['./usermasters.component.scss']
})
export class UsermastersComponent implements OnInit {

	constructor(
		public dialog: MatDialog
	) { }

	ngOnInit() {

	}

}
