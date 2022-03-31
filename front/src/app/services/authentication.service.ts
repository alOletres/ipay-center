import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { EndPoint } from "./../globals/endpoints";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
	errorMsg: any;

	constructor( private http : HttpClient,
				private method : StoreService) { }

	checkuserAccount (data : any){
		return this.http.post(`${ EndPoint.endpoint }/user/users/checkuserAccount`, data).toPromise()
	}

	getUser (data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/getUser`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	getUserForBfranchise(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/getUserForBfranchise`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	getForBranchIB(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/getForBranchIB`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	getForBranchTeller(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/getForBranchTeller`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getForFranchiseList(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/getForFranchiseList`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getTellerlistFr(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/getTellerlistFr`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getTellerIbarangay(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/getTellerIbarangay`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	loginLogs(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/loginLogs`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	signOut(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/signOut`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	tellerChangePassword(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/user/users/tellerChangePassword`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			throw err
		}
	}

	function_changePassword(data:any):Observable<any>{
		
		return this.http.post(`${ EndPoint.endpoint }/user/users/changePassword`, data, this.method.setAuthorizedRequest())
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
	function_getUsernameBranchCode():Observable<any>{
		return this.http.get(`${ EndPoint.endpoint }/user/users/getUsernameBranchCode`, this.method.setAuthorizedRequest())
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
	function_putWhitelist(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/user/users/putWhitelist`, data, {responseType : 'text'})
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
	function_getBranchCodeWithWhitelist():Observable<any>{
		return this.http.get(`${ EndPoint.endpoint }/user/users/getBranchCodeWithWhitelist`)
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

	function_getBranchNameOfTeller(data:any):Observable<any>{
		return this.http.post(`${ EndPoint.endpoint }/user/users/getBranchNameOfTeller`, data, this.method.setAuthorizedRequest())
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
	function_getNameOfBranchesForModalAdmin(data:any):Observable<any>{
		
		return this.http.post(`${ EndPoint.endpoint }/user/users/getNameOfBranchesForModalAdmin`, data, this.method.setAuthorizedRequest())
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
	updateAccountInformationBranches(data:any):Observable<any> {

		return this.http.post(`${ EndPoint.endpoint }/user/users/updateAccountInformationBranches`, data, this.method.setAuthorizedRequest())
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

	changePasswordForBranches(data:any) : Observable<any>{

		return this.http.post(`${ EndPoint.endpoint }/user/users/changePasswordForBranches`, data, {responseType : 'text'})
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
