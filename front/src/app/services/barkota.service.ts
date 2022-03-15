import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from "@angular/common/http";
import { EndPoint } from "./../globals/endpoints";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BarkotaService {
	 errorMsg: string;
	constructor(private http : HttpClient) { 
		
	}
	
	function_getBarkotaToken() {

		return this.http.get(`${ EndPoint.endpoint }/barkota/barkotas/getBarkotaToken`)
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			})
		);
	}
	function_getShippingLines(data:any){
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/getShippingLines`, data, {responseType: 'text'}).toPromise()
	}

	function_getRoutes (data:any) : Observable <any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/getRoutes`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			})
		);
	}
	function_listOfTrips(data:any){
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/listOfTrips`, data, {responseType: 'text'}).toPromise()
	}

	function_ticketPrice(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/ticketPrice`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			})
		);
	}
	function_getVoyageCots(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/getVoyageCots`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			})
		);
	}
	function_computeCharges(data:any):Observable<any>{
		// return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/computeCharges`, data, {responseType: 'text'}).toPromise()
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/computeCharges`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			})
		);
	}

	 function_bookNow(data:any):Observable<any>{
		
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/bookNow`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			})
		);
				
	}

	function_searchTicket(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/searchTicket`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			})
		);
	}

	function_searchVoucherByTicket(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/searchVoucherByTicket`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			}),
			
		)
	}

	function_searchTransactionNo(data:any):Observable<any> {
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/searchTransactionNo`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			}),
			
		)
	}

	function_refundTicket(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/refundTicket`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			}),
			
		)
	}

	function_voidTicket(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/voidTicket`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			}),
			
		)
	}

	function_revalidateTicket(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/revalidateTicket`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			}),
			
		)
	}

	function_saveBarkotaBookingTransactions(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/saveBarkotaBookingTransactions`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			}),
			
		)
	}

	function_getByTellerTransactions (data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/barkota/barkotas/getByTellerTransactions`, data, {responseType: 'text'})
		.pipe(
			catchError(error => {
				
				if (error.error instanceof ErrorEvent) {

					this.errorMsg = `Error: ${error.error.message}`;

				} else {
					this.errorMsg = this.getServerErrorMessage(error);
					
				}
				return throwError(this.errorMsg);
			}),
			
		)
	}

	private getServerErrorMessage(error: HttpErrorResponse): string {
		
		switch (error.status) {
	
            case 404: {
                return `Not Found`;
            }
            case 403: {
                return `Access Denied= ${this.errorMsg}`;
            }
            case 500: {
                return `Internal Server Error ${error.error}`;
            }
            default: {
                return `Unknown Server Error`;
            }

        }
    }
}

