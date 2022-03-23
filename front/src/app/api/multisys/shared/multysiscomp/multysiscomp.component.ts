import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-multysiscomp',
	templateUrl: './multysiscomp.component.html',
	styleUrls: ['./multysiscomp.component.css']
})
export class MultysiscompComponent implements OnInit {

	billingForm: FormGroup;

	constructor(
		private $dialogRef: MatDialogRef<MultysiscompComponent>,
		private $formGroup: FormBuilder
	) {
		this.billingForm = this.$formGroup.group({
			CostumersName: ['', Validators.required],
			contactNo: [''],
			RefNo: ['', Validators.required],
			Amount: ['', Validators.required],

		})
	}

	ngOnInit(): void {

	}

	closeDialog() {
		this.$dialogRef.close()
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
