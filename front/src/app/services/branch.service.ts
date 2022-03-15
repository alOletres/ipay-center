import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { EndPoint } from "./../globals/endpoints";

@Injectable({
  	providedIn: 'root'
})
export class BranchService {

	constructor(
		private http: HttpClient
	) { }

	saveBranch(data: any) {
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/saveBranch`, data, {responseType: 'text'}).toPromise()
	}

	getBranchList() {
		return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getBranches`).toPromise()
	}

	updateBranch(data: any) {
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateBranch`, data, {responseType: 'text'}).toPromise()
	}
	updateBranchStatus(data:any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateBranchStatus`, data, {responseType: 'text'}).toPromise()
	}

	// end of CRUD in Branch Head

	// start of CRUD in Franchise 

	saveFbranch(data: any){
		return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveFbranch`, data, {responseType: 'text'}).toPromise()
	}
	getFranchlist(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getFranchiselist`).toPromise()
		}catch(err){
			return err
		}
	}
	savefWallet (data:any){
		return this.http.post(`${ EndPoint.endpoint}/branch/branchs/savefWallet`, data, {responseType: 'text'}).toPromise()
	}
	updateFbranchStatus(data:any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateFbranchStatus`, data, {responseType: 'text'}).toPromise()
	}
	updateFbranch (data: any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateFbranch`, data, {responseType: 'text'}).toPromise()
	}

	// start of CRUD in Ibarangay
	saveIbarangay(data: any){
		return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveIbarangay`, data, {responseType: 'text'}).toPromise()
	}
	saveibWallet (data:any){
		return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveibWallet`, data, {responseType: 'text'}).toPromise()
	}
	getIbarangaylist(){
		return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getIbarangaylist`).toPromise()
	}
	updateStatusIb(data:any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateStatusIb`, data, {responseType: 'text'}).toPromise()
	}
	updateIbarangaylist(data:any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateIbarangaylist`, data, {responseType: 'text'}).toPromise()
	}
	addibTeller(data:any){
		// if(data.fbranchCode !== undefined){
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/addFranchiseTeller`, data, {responseType: 'text'}).toPromise()
		// }else{
		// }
	}

	addTellerAdminFranchise(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/addibTeller`, data, {responseType: 'text'}).toPromise()
		}catch(err){
			throw err
		}
	}

	getTellerlist(){
		try{
			return this.http.get(`${ EndPoint.endpoint }/branch/branchs/getTellerlist`).toPromise()
		}catch(err){
			throw err
		}
	}
	updateStatusTeller(data:any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateStatusTeller`, data, {responseType: 'text'}).toPromise()
	}

	async updateTeller_list(data:any){
		try{
			return await this.http.post(`${ EndPoint.endpoint }/branch/branchs/updateTeller_list`, data, {responseType: 'text'}).toPromise()
		}catch(err){
			return err
		}
	}
	saveIbarangayForapproval(data:any){
		return this.http.post(`${ EndPoint.endpoint}/branch/branchs/saveIbarangayForapproval`, data, {responseType: 'text'}).toPromise()
	}
	getIbarangayForApproval(data:any){		
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/getIbarangayForApproval`, data).toPromise()
	}
	approvedIBstatus(data:any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/approvedIBstatus`, data, {responseType: 'text'}).toPromise()
	}

	declineiBarangay(data:any){
		return this.http.post(`${ EndPoint.endpoint }/branch/branchs/declineiBarangay`, data, {responseType: 'text'}).toPromise()
	}
	saveiB(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint }/branch/branchs/saveiB`, data, {responseType: 'text'}).toPromise()
		}catch(err){
			throw err
		}
	}
	addIbarangayTeller(data:any){
		try{
			return this.http.post(`${ EndPoint.endpoint}/branch/branchs/addIbarangayTeller`, data, {responseType: 'text'}).toPromise()
		}catch(err){
			throw err
		}
	}
}
