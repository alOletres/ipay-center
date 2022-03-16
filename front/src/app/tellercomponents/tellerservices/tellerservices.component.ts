import { Component, OnInit } from '@angular/core';
import { BarkotaService } from './../../services/barkota.service'
import {CookieService} from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SnackbarServices } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-tellerservices',
  templateUrl: './tellerservices.component.html',
  styleUrls: ['./tellerservices.component.scss']
})
export class TellerservicesComponent implements OnInit {
	data:any
	expiredDate : any
	constructor(private http_barko : BarkotaService,
				private cookieService : CookieService,
				private _snackBar : SnackbarServices) { }

	ngOnInit(){
		// init

	}
	
	async function_getToken(){

		if(this.cookieService.get('token') === ''){
			
			await this.http_barko.function_getBarkotaToken()
			
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
					// httpOnly: true
				});
			})
		
		}else{

			console.log('token exist');
			
		}

	}

	function_ibayad(){ this.cookieService.set('alejandro', 'JSON.stringify(result)', { expires : 172800 + Date.now() }) }

	biyahe_Ko(){ window.open(`http://202.54.157.87/i-paycenter/`, "_blank") }
	
	sabong(){ window.open(`https://wpc2027.live/`, '_blank') }

	ubx(){ window.open(`https://www.i2i.ph/login`, '_blank') }

}
