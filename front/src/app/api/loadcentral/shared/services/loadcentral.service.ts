import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { EndPoint } from "./../../../../globals/endpoints";
	@Injectable({
	providedIn: 'root'
	})														
export class LoadcentralService {

	constructor( private http: HttpClient ) {
		
	}
	sellProduct(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/eload/eloads/sellProduct`, data, {responseType: 'text'}).toPromise()
		}catch(err){
			throw err
		}
	}
}
