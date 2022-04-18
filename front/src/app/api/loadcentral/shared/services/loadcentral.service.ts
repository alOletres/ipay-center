import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { EndPoint } from "./../../../../globals/endpoints";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StoreService } from 'src/app/store/store.service';
	@Injectable({
	providedIn: 'root'
	})														
export class LoadcentralService {
	errorMsg: any;

	constructor( private http: HttpClient,
				 private method : StoreService ) {
		
	}
	sellProduct(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/eload/eloads/sellProduct`, data, this.method.setAuthorizedRequest())
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
		}catch(err){
			throw err
		}
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

	getLoadCentralTransactions(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/eload/eloads/getLoadCentralTransactions`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	async eLoadCheckStatus(data:any){
		try{
			return await this.http.post(`${ EndPoint.endpoint }/eload/eloads/eLoadCheckStatus`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

}
