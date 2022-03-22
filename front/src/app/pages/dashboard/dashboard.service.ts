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
	async getTransactionLoadCentralByBranch(data:any){
		try{
			return await this.http.post(`${ EndPoint.endpoint }/eload/eloads/getTransactionLoadCentralByBranch`, data, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}
	async getLoadCentralTransactions(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/eload/eloads/getLoadCentralTransactions`).toPromise()
		}catch(err){
			return err
		}
	}
	async getMotherWallet(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/admin/admins/getMotherWallet`, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}
	async commission(){
		try{
			return await this.http.get(`${ EndPoint.endpoint }/admin/admins/getCommission`, {responseType : 'text'}).toPromise()
		}catch(err){
			return err
		}
	}
}
