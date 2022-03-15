import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  	providedIn: 'root'
})
export class ReceivablesService {

	private sub$ = new Subject<any>()
	sub$$ = this.sub$.asObservable()

	getObj(data: any) {
		this.sub$.next(data)
		// console.log(data);
		
	}

}
