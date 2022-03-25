import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EndPoint } from "./../../globals/endpoints";

@Injectable({
providedIn: 'root'
})
export class MultisysService {

  	constructor(private http : HttpClient) { }
	
 	async mutisysInquire(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/multisy/mutisys/inquireMultisys`, data, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}

}
