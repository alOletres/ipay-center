
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarServices } from 'src/app/services/snackbar.service';
import { SettingsService } from './settings.service';
import SocketService from 'src/app/services/socket.service';
import { ResetformService } from 'src/app/services/resetform.service';




@Component({
  selector: 'app-macsettings',
  templateUrl: './macsettings.component.html',
  styleUrls: ['./macsettings.component.scss']
})
export class MacsettingsComponent implements OnInit {



	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

	displayedColumns : any[] = ['no', 'message', 'createdBy', 'createdDate', 'updatedBy', 'status', 'action']
	searchBranchCode : any
	dataSourceWhiteListed:any;
	announcementForm : FormGroup
	data: any;
	btnName: string;
	annoncementCard : boolean = false
	createAnnoucementCard : boolean = true
	progress : boolean = false
	constructor(private fb : FormBuilder,
				private _snackBar : SnackbarServices,
				private http_settings : SettingsService,
				private socketService : SocketService,
				private resetForm : ResetformService,
				) {
		this.announcementForm = this.fb.group({ message : new FormControl('', [Validators.required]) })

	}

	async ngOnInit(){
	
		
		this.btnName = 'Save'
		await this.displayAnnouncement()
	}

	async createAnnouncement(){
		/**socket will turn on after creating announcement to spread all the branches */
		this.progress= true

		if(this.btnName === 'Save'){

			await this.http_settings.createAnnouncement({ messages: this.announcementForm.value ,createdBy: atob(sessionStorage.getItem('type')) })		
			.then((message:any)=>{
				
				(JSON.parse(message).message === 'ok') ? `${this._snackBar._showSnack('Successfully Created', 'success')} ${this.resetForm.reset(this.announcementForm)}`
				: this._snackBar._showSnack('Something went wrong', 'error')
				this.ngOnInit()
				this.socketService.sendEvent("eventSent", {data: "response_newAnnouncement"})/**SOCKET SEND EVENT */
				
				this.progress = false

			}).catch((err)=>{
				this._snackBar._showSnack(err, 'error')
				this.progress = false
			})

		}else{
			await this.http_settings.updateAnnouncement({ data : this.announcementForm.value, updatedBy : atob(sessionStorage.getItem('type')) })

			.then((message:any)=>{
	
				
					
				(JSON.parse(message).message === 'ok') ? `${this._snackBar._showSnack('Successfully Updated', 'success')} ${this.resetForm.reset(this.announcementForm)}`
				: this._snackBar._showSnack('Something went wrong', 'error')
				this.ngOnInit()
				this.socketService.sendEvent("eventSent", {data: "response_newAnnouncement"})/**SOCKET SEND EVENT */
				this.progress = false
			}).catch((err)=>{
				this.progress = false
				this._snackBar._showSnack(err, 'error')
			})
		}
		
	}

	async displayAnnouncement(){

		const res : any = await this.http_settings.displayAnnouncement()
		let result = JSON.parse(res).map((data:any)=>data)
		
		this.data = new MatTableDataSource<any>(result)
		this.data.paginator = this.paginator	
	}

	async changeStatus(data:any){
		this.progress = true
		/**socket will turn on after creating announcement to spread all the branches */
		await this.http_settings.changeStatus({ value : data })
		.then((message:any)=>{
			
			(JSON.parse(message).message === 'ok') ? `${this._snackBar._showSnack('Successfully Change', 'success')} ${this.ngOnInit()} ${this.socketService.sendEvent("eventSent", {data: "response_Announcement_changeStatus"})}`
			: this._snackBar._showSnack('Something went wrong', 'error')

			this.progress = false
			/**SOCKET SEND EVENT */
			
		}).catch((err)=>{
			this.progress = false
			this._snackBar._showSnack(err, 'error')
		})
	}

	async updateMessage(data:any){
		this.btnName = 'Save Changes'
		this.announcementForm = this.fb.group({ message : new FormControl(data.message, [Validators.required]) , id : data.id })
	}

	showAnnouncement(){
		this.annoncementCard = true
		this.createAnnoucementCard = false
	}
	btnBack(){
		this.annoncementCard = false
		this.createAnnoucementCard = true
	}



	cliiiccckkkkmemememmememe() {

	}
}

