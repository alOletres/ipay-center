import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { EndPoint } from "./../globals/endpoints";
import { StoreService } from '../store/store.service';

@Injectable({
  	providedIn: 'root'
})
export class BranchService {

	constructor(
		private http: HttpClient,
		private method : StoreService
	) { }

	saveBranch(data: any) {
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/saveBranch`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	getBranchList() {
		try{
			return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getBranches`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	updateBranch(data: any) {
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateBranch`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	updateBranchStatus(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateBranchStatus`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	saveFbranch(data: any){
		return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveFbranch`, data, this.method.setAuthorizedRequest()).toPromise()
	}
	getFranchlist(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getFranchiselist`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			return err
		}
	}
	savefWallet (data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/savefWallet`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	updateFbranchStatus(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateFbranchStatus`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){

		}
	}
	updateFbranch (data: any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateFbranch`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	saveIbarangay(data: any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveIbarangay`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	saveibWallet (data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveibWallet`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getIbarangaylist(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getIbarangaylist`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	updateStatusIb(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateStatusIb`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	updateIbarangaylist(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateIbarangaylist`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	addibTeller(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/addFranchiseTeller`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	addTellerAdminFranchise(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/addibTeller`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			throw err
		}
	}

	getTellerlist(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getTellerlist`, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	updateStatusTeller(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateStatusTeller`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	async updateTeller_list(data:any){
		try{
			return await this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateTeller_list`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err){
			return err
		}
	}
	saveIbarangayForapproval(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveIbarangayForapproval`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	getIbarangayForApproval(data:any){		
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/getIbarangayForApproval`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	approvedIBstatus(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/approvedIBstatus`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	declineiBarangay(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/declineiBarangay`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	saveiB(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/saveiB`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
	addIbarangayTeller(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/addIbarangayTeller`, data,this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}

	async resetPassword(data:any){
		try{
			return await this.http.post(`${ EndPoint.endpoint }/user/users/resetPassword`, data, this.method.setAuthorizedRequest()).toPromise()
		}catch(err:any){
			return err
		}
	}
}
