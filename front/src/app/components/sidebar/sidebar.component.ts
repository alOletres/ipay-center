import { Component, OnInit, ViewChild } from '@angular/core';

import { WalletService } from 'src/app/services/wallet.service';
import { BranchService } from "./../../services/branch.service"
import SocketService from 'src/app/services/socket.service';
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	isExpanded = true;
	isShowing = false;
	isOpenSubMenu = false;
	isOpenSubMenu_ =false
	type : any
	type_code :any
	datalenght : any
	topLength: any;
	constructor(private httpbranch : BranchService,
				private http_wallet : WalletService,
				private socketService : SocketService) {
					
					this.socketService.eventListener("response_topUpload").subscribe(()=> { this.lengthTopUpload() })
					this.socketService.eventListener("response_approvedTopUp").subscribe(()=> { this.lengthTopUpload() })
					this.socketService.eventListener("response_addiBarangay").subscribe(()=> { this.ngOnInit() })
				 }

	async ngOnInit() {
		this.type = atob(sessionStorage.getItem('type'));		
		this.type_code = atob(sessionStorage.getItem('code'))

		this.lengthTopUpload()
		
	}

	openUiElements() {
		this.isOpenSubMenu = !this.isOpenSubMenu;
	}
	openUiElements_() {
		this.isOpenSubMenu_ = !this.isOpenSubMenu_;
	}

	async lengthTopUpload(){

	
		if(atob(sessionStorage.getItem('type')) === 'Admin' || atob(sessionStorage.getItem('type')) === 'Branch Head'){

			const result : any =	await this.httpbranch.getIbarangayForApproval({code : this.type_code});
			
			this.http_wallet.function_adminTopUpload()
			.subscribe((data:any)=>{
				
				this.datalenght = data.length + result.length
				
			})

		}else{
			
			const result : any = await this.http_wallet.getTopup_listForBranchHead({code : atob(sessionStorage.getItem('code'))}) 
			this.datalenght = result.length
		}
		
	}

}
