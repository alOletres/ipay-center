import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EndPoint } from "./../../globals/endpoints";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  	constructor(private http : HttpClient) { }

	
	async createAnnouncement(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/admin/admins/createAnnouncement`, data, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}

	async displayAnnouncement(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/admin/admins/displayAnnouncement`, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}

	async changeStatus(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/admin/admins/changeStatus`, data, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}

	async updateAnnouncement(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/admin/admins/updateAnnouncement`, data, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}
}
