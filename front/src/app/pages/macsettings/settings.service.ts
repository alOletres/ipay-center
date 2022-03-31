import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EndPoint } from "./../../globals/endpoints";
import { StoreService } from 'src/app/store/store.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  	constructor(private http : HttpClient,
				private method : StoreService) { }

	
	async createAnnouncement(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/admin/admins/createAnnouncement`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			return err
		}
	}

	async displayAnnouncement(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/admin/admins/displayAnnouncement`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			return err
		}
	}

	async changeStatus(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/admin/admins/changeStatus`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			return err
		}
	}

	async updateAnnouncement(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/admin/admins/updateAnnouncement`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			return err
		}
	}
}
