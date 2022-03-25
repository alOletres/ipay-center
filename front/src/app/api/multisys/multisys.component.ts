import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MultysiscompComponent } from "./shared/multysiscomp/multysiscomp.component";
import { MultisysService } from './multisys.service';
@Component({
	selector: 'app-multisys',
	templateUrl: './multisys.component.html',
	styleUrls: ['./multisys.component.scss']
})
export class MultisysComponent implements OnInit {

	constructor(
		private $dialog: MatDialog,
		private http_multisys : MultisysService
	) { }

	ngOnInit(): void {

	}
	openDialogMltsis() {
		this.$dialog.open(MultysiscompComponent,  {
			width: '400px',
			disableClose : true,
		})
	}
}
