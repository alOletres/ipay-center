import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarServices } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-cotsdialog',
  templateUrl: './cotsdialog.component.html',
  styleUrls: ['./cotsdialog.component.scss']
})
export class CotsdialogComponent implements OnInit {

	cotsData : any
	constructor(public dialogRef: MatDialogRef<CotsdialogComponent>,
				@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
				private _snackBar : SnackbarServices) {
			
			this.cotsData = data.cots
		}

	ngOnInit(){

	}

	function_takenCots(){
		this._snackBar._showSnack("Cots Already taken", 'error')
	}
}
