import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EndPoint } from "./../../globals/endpoints";
import { StoreService } from 'src/app/store/store.service';

	@Injectable({
	providedIn: 'root'
	})
	export class DashboardService {

	constructor( private http : HttpClient,
				 private method : StoreService) { }

	async branches(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/branch/branchs/getFranchiselist`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	async barGraphData(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/admin/admins/barGraphData`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	async getBarkotaTransactions(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/barkota/barkotas/getBarkotaTransactions`,  this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	async displayAnnouncement(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/admin/admins/displayAnnouncement`,  this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	async getLogs(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/admin/admins/getActivityLogs`,  this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	async getTransactionLoadCentralByBranch(data:any){
		try{
			return await this.http.post(`${ EndPoint.endpoint }/eload/eloads/getTransactionLoadCentralByBranch`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	async getLoadCentralTransactions(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/eload/eloads/getLoadCentralTransactions`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	async getMotherWallet(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/admin/admins/getMotherWallet`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	async commission(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/admin/admins/getCommission`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	async multisys(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/multisy/mutisys/getMultisysTransaction`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			throw err
		}
	}
}
