import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackbarComponent } from './../components/snackbar/snackbar.component'; // SnackbarComponent for pop-ups/notifications


@Injectable({
    providedIn: 'root'
})

export class SnackbarServices {

    constructor(
		public snackBar: MatSnackBar,
	) {}

	showSnack(msg: any, errors: any) {

		return this.snackBar.open(msg, errors, {
			
			duration: 10000,
			panelClass: ['red-snackbar']
		});

	}

	_showSnack(msg: any, snackType: any) {

		const _snackType: any = snackType = snackType !== undefined ? snackType : 'success';

		this.snackBar.openFromComponent(SnackbarComponent, {
			duration: 10000,
			horizontalPosition: 'right',
			verticalPosition: 'bottom',
			panelClass: [`${snackType}-snackbar`],
			data: { message: msg, snackType: _snackType, action: 'Close' },
		});

	}

}
