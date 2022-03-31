import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EndPoint } from "./../../globals/endpoints";
import { StoreService } from 'src/app/store/store.service';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
	

    
	constructor(private http : HttpClient,
				private method : StoreService) { }

 	async getLogs(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/admin/admins/getActivityLogs`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	
	async getBarkotaTransactions(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/barkota/barkotas/getBarkotaTransactions`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	async getLoadCentralTransactions(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/eload/eloads/getLoadCentralTransactions`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			return err
		}
	}
	async multisys(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/multisy/mutisys/getMultisysTransaction`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
}
