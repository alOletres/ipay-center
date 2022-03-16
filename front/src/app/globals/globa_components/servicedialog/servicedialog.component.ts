import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarServices } from './../../../services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs'
@Component({
	selector: 'app-servicedialog',
	templateUrl: './servicedialog.component.html',
	styleUrls: ['./servicedialog.component.scss']
})
export class ServicedialogComponent implements OnInit {
	servicesform : any
	srcResult : any
	myimage :any
	constructor(
		public dialogRef: MatDialogRef<ServicedialogComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private fb : FormBuilder) {
			// constructor process here
			this.servicesform = this.fb.group({
				// someFCN: [{ value:'', disabled: false },Validators.required],
         		//  file: { value:'', disabled: false }
			})
		}

	ngOnInit(){

	}

	files: File[] = [];

	onSelect(event: any) {
		this.files = event.addedFiles;
	}

	onRemove(event:any) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}
	
}


