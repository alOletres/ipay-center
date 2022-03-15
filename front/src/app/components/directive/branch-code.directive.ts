import { Directive, ElementRef, Input } from '@angular/core';

	@Directive({
	selector: '[appBranchCode]'
	})
export class BranchCodeDirective {
	@Input() appBranchCode : any
  	constructor( private el : ElementRef) { }

	ngAfterViewInit(){

		let el = this.el.nativeElement
		let data = this.appBranchCode
		
		let code = data.tellerCode.slice(0,3) === 'BRT' ? data.ibrgy_code : data.fiB_Code
		el.innerHTML = `<span >${code}</span>`
	
	}

}
