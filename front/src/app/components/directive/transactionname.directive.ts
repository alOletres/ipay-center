import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTransactionname]'
})
export class TransactionnameDirective {
	@Input() appTransactionname: any

	constructor( private el : ElementRef ) { }

	ngAfterViewInit(){

		let el = this.el.nativeElement
		let data = this.appTransactionname
		let result :any = data.slice(0,3) === 'BRK' ? 'BARKOTA' 
						: data.slice(0,3) === 'IPC' ? 'LOAD CENTRAL' 
						: ''
		el.innerHTML = `<span  >${result}</span>`
		
	}

}
