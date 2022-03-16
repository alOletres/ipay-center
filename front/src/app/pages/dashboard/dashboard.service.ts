import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EndPoint } from "./../../globals/endpoints";

	@Injectable({
	providedIn: 'root'
	})
	export class DashboardService {

	constructor( private http : HttpClient) { }

	async branches(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/branch/branchs/getFranchiselist`, {responseType: 'text'}).toPromise()
		}catch(err){
			return err
		}
	}

	async barGraphData(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/admin/admins/barGraphData`, {responseType: 'text'}).toPromise()
		}catch(err){
			return err
		}
	}

	async getBarkotaTransactions(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/barkota/barkotas/getBarkotaTransactions`, {responseType: 'text'}).toPromise()
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

	async getLogs(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/admin/admins/getActivityLogs`, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}
}
