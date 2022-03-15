import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LccompntTransComponent } from '../lccompnt-trans/lccompnt-trans.component';

@Component({
	selector: 'app-lc-trans',
	templateUrl: './lc-trans.component.html',
	styleUrls: ['./lc-trans.component.scss']
})
export class LcTransComponent implements OnInit {

	constructor(
		private $dialog: MatDialog
	) { }

	ngOnInit(): void {
	}

	openDialogLC() {
		const dia = this.$dialog.open(LccompntTransComponent,  {
			width: '400px',
			disableClose : true,
		})
	}

}
