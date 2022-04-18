import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { EndPoint } from "./../globals/endpoints";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from '../store/store.service';
@Injectable({
  providedIn: 'root'
})
export class WalletService {
	errorMsg: any;

	constructor( private http : HttpClient,
				 private method : StoreService) {
		
	}
	// functions
	topupload(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/topupload`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getTopup_list(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/getTopup_list`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getTopup_listForBranchHead (data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/getTopup_listForBranchHead`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	approvedTopupLoad(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/approvedTopupLoad`, data, this.method.setAuthorizedRequestWithBlob()).toPromise()
		}catch(err:any){
			return err
		}
	}
	sendLoadtable(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/sendLoadtable`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getFranchisewallet(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/getFranchisewallet`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	decreaseWalletFranchise(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/decreaseWalletFranchise`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	updateLoadstatus(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/updateLoadstatus`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}


	getOverallWallet(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/getOverallWallet`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	function_checkAvailableWallet(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/checkAvailableWallet`, data, this.method.setAuthorizedRequest())
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
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/adminTopUpload`, this.method.setAuthorizedRequest())
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
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/walletHistory`, data, this.method.setAuthorizedRequest())
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
		return this.http.post(`${ EndPoint.endpoint }/wallet/wallets/checkFranchiseWallet`, data, this.method.setAuthorizedRequest())
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
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/walletTransactionForAdminBranchHead`, this.method.setAuthorizedRequest())
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
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/walletBranchesMonitoring`, this.method.setAuthorizedRequest())
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
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/walletiBarangayMonitoring`, this.method.setAuthorizedRequest())
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
		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/topUploadsIbarangayHistory`, this.method.setAuthorizedRequest())
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

		return this.http.get(`${ EndPoint.endpoint }/wallet/wallets/topUploadsFranchiseeHistory`, this.method.setAuthorizedRequest())
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
