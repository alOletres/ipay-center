import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { EndPoint } from "./../globals/endpoints";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WalletService {
	errorMsg: any;

	constructor( private http : HttpClient) {
		
	}
	// functions
	topupload(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/topupload`, data, {responseType: 'text'}).toPromise()
	}
	getTopup_list(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/getTopup_list`, data).toPromise()
	}
	getTopup_listForBranchHead (data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/getTopup_listForBranchHead`, data).toPromise()
	}
	approvedTopupLoad(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/approvedTopupLoad`, data, {responseType: 'blob'}).toPromise()
	}
	sendLoadtable(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/sendLoadtable`, data, {responseType: 'text'}).toPromise()
	}
	getFranchisewallet(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/getFranchisewallet`, data).toPromise()
	}
	decreaseWalletFranchise(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/decreaseWalletFranchise`, data).toPromise()
	}
	updateLoadstatus(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/updateLoadstatus`, data, {responseType: 'text'}).toPromise()
	}

	function_checkAvailableWallet(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/checkAvailableWallet`, data, {responseType: 'text'})
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

	function_adminTopUpload(){
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/adminTopUpload`)
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
	
	function_walletHistory(data:any){
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/walletHistory`, data)
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
	function_checkFranchiseWallet(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/checkFranchiseWallet`, data)
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

	function_walletTransactionForAdminBranchHead(){
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/walletTransactionForAdminBranchHead`)
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


	walletBranchesMonitoring(){
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/walletBranchesMonitoring`)
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

	walletiBarangayMonitoring(){
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/walletiBarangayMonitoring`)
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
	topUploadsIbarangayHistory(){
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/topUploadsIbarangayHistory`)
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

	topUploadsFranchiseeHistory(){

		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/topUploadsFranchiseeHistory`)
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
