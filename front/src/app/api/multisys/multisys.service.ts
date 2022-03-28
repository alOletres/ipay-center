import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { EndPoint } from "./../../globals/endpoints";
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class MultisysService {
	errorMsg: any;

  	constructor(private http : HttpClient) { }
	
 	mutisysInquire(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/multisy/mutisys/inquireMultisys`, data, {responseType : 'text'})
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

	proceedTransaction(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/multisy/mutisys/proceedTransaction`, data, {responseType : 'text'})
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
	async multisys(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/multisy/mutisys/getMultisysTransaction`).toPromise()
		}catch(err:any){
			throw err
		}
	}

}
