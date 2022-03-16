import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
	selector: 'app-snackbar',
	templateUrl: './snackbar.component.html',
	styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

	constructor(
		private snackBarRef: MatSnackBarRef<SnackbarComponent>,
		@Inject(MAT_SNACK_BAR_DATA) public data: any
	) { }

	ngOnInit() {

	}

	get getIcon() {
        switch (this.data.snackType) {
			case 'success':
				return 'check';
			case 'error':
				return 'error';
			case 'warn':
				return 'warning';
			case 'info':
				return 'info';
        }
    }

	dismiss(): void {
		this.snackBarRef.dismiss();
	}

}
