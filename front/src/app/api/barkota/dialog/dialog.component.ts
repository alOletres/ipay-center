import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { observable, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from "@angular/router";
// moment handling time
import moment from 'moment';
// services
import {CookieService} from 'ngx-cookie-service';
import { BarkotaService } from './../../../services/barkota.service'
import { SnackbarServices } from './../../../services/snackbar.service';
// components
import { LoadingDialogComponent } from './../../../components/loading-dialog/loading-dialog.component'
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

	
	passengerForm :FormGroup
	contactForm : FormGroup
	discountTypes :any [] = ['adult', 'student', 'minor', 'senior', 'infant', 'pwd']
	driverList :any [] = ['not a driver', 'driver']
	dataTicket : any
	// dataSource : any
	displayedColumns : any [] = ['driverTotal', 'terminalFee', 'serviceCharge', 'outletServiceFee', 'ticketTotal', 'total']
	departurePriceId : any
	departureCotId : any
	event : any
	errorMsg : any
	discountType: any;
	currentWallet : any
	observableWallet: Observable<any>;
	constructor(public dialogRef: MatDialogRef<DialogComponent>,
    			@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
				private cookieService : CookieService,
				private http_barko : BarkotaService,
				private fb : FormBuilder,
				private _snackBar : SnackbarServices,
				private router :Router,
				private dialog : MatDialog,
				private http_wallet : WalletService) 
		{
			
		}

	ngOnInit(){
		
		
	}

	closeDialog(){

        this.dialogRef.close();
		let currentUrl = this.router.url;
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = 'reload';
		this.router.navigate([currentUrl]);


    }
	
}


