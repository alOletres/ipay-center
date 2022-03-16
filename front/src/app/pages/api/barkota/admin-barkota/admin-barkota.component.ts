import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BarkotaService } from 'src/app/services/barkota.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-admin-barkota',
  templateUrl: './admin-barkota.component.html',
  styleUrls: ['./admin-barkota.component.scss']
})
export class AdminBarkotaComponent implements OnInit {

	refundTicketForm : FormGroup
	voidTicketForm : FormGroup
	
	reasons : any [] = ['others', 'cancelled', 'passenger late']
	filename1 : any
	filename2 : any
	expiredDate: any;
	token  :any
	ticketTableTransactions : boolean = false
	barkotaApiCard : boolean = true
	btnBack :boolean = false

	constructor(private fb : FormBuilder,
				private http_barko : BarkotaService,
				private cookieService : CookieService,
				private _snackBar : SnackbarServices,
				private router : Router) { }

	ngOnInit(){
		this.refundTicketForm = this.fb.group({
			ticketId 	: new FormControl('', [Validators.required]),
			reasonId 	: new FormControl('', [Validators.required]),
			reason 		: new FormControl('', [Validators.required])
		})

		this.voidTicketForm = this.fb.group({
			ticketId : new FormControl('', [Validators.required]),
			remarks : new FormControl('', [Validators.required])
		})

		if(this.cookieService.get('token') === ''){
			this.router.navigate(['/tellerdashboard']);
			this._snackBar._showSnack('Token is Expired Try Again', 'error')
		}else{
			// BOOLEAN HERE
		}
	}

	// function_submitRefundTicket(){

	// 	const token = this.cookieService.get('token')
	// 	try{
	// 		this.http_barko.function_refundTicket({

	// 			data : this.refundTicketForm.value,
	// 			token : JSON.parse(token)

	// 		}).pipe(
	// 			catchError(error=>{

	// 				this._snackBar._showSnack(error, 'error');
	// 				return of([]);

	// 			})
	// 		).subscribe(data=>{
	// 			console.log(JSON.parse(data));
				
	// 		})
	// 	}catch(e){
	// 		console.log(e);
			
	// 	}
	// 	console.log(this.token);
		
	// }

	async function_getToken(){


		if(atob(sessionStorage.getItem('type')) === 'Admin'){
			this.btnBack = true
			this.ticketTableTransactions = true
			this.barkotaApiCard = false
			
			if(this.cookieService.get('token') === ''){
			
				this.http_barko.function_getBarkotaToken()
			   
			   .pipe(
				   catchError(error=>{
					   this._snackBar._showSnack(error, 'error')
					   return of([])
				   })
			   ).subscribe((result:any)=>{
				   
				   const seconds : number = parseInt(result.expires_in)
				   const secondss = Number(seconds);
				   var d = Math.floor(secondss / (3600*24));
				   var h = Math.floor(secondss % (3600*24) / 3600);
				   var m = Math.floor(secondss % 3600 / 60);
				   var s = Math.floor(secondss % 60);
				   var dDisplay = d > 0 ? d + (d == 1 ? " day, " : "") : "";
				   var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
				   var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
				   var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
				   const days : any = dDisplay + hDisplay + mDisplay + sDisplay;
						   
				   this.expiredDate = new Date();
				   this.expiredDate.setDate(this.expiredDate.getDate() + parseInt(days));
				   this.cookieService.set('token', JSON.stringify(result), { expires : this.expiredDate, 
				   
				   });
   
				 
			   })
   
		   }else{
   
			   console.log('token exist');
			   
		   }


		}else{


			this._snackBar._showSnack('UNDER MAINTENANCE', 'warning')

		}
		

		

	}
	function_submitVoidTicket(){

		const token = this.cookieService.get('token')

		try{
			this.http_barko.function_voidTicket({
				data : this.voidTicketForm.value,
				token : JSON.parse(token)
			}).pipe(
				catchError(error=>{
					this._snackBar._showSnack(error, 'error');
					return of([]);
				})
			).subscribe(data=>{
				
				if(JSON.parse(data).success === false){
					this._snackBar._showSnack('Please your credentials', 'error')
				}else{
					this._snackBar._showSnack('Successfully Void your Ticket', 'success')
					this.ngOnInit();
				}
				
			})
		}catch(e){
			console.log(e);
			
		}
	}

	function_back(){
		this.ticketTableTransactions = false
		this.barkotaApiCard = true
		this.btnBack = false
	}

}
