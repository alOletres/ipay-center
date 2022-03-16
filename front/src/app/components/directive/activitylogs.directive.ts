import { Directive, ElementRef, Input } from '@angular/core';
import moment from 'moment';

	@Directive({
	selector: '[appActivitylogs]'
	})
	export class ActivitylogsDirective {
	@Input() appActivitylogs : any
	
	constructor( private el : ElementRef) {
		
	}

	ngAfterViewInit(){
		let el = this.el.nativeElement
		let data = this.appActivitylogs
		let isLogging = data.affectedColumn === "isOnline"
		
		let action = data.affectedColumn === 'isOnline' ? "logged in to" : "logged out from"
         
		el.innerHTML = `You ${ action } the system <span class='w3-text-gray'>${ moment(data.logDate).fromNow() }</span>`
		
		// if(isLogging || data.affectedColumn === "offLine"){
			
			
		// }else{
		// 	console.log('false');
			
		// }
	}
}
