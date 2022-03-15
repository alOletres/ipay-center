import { Injectable } from '@angular/core';

@Injectable({
  	providedIn: 'root'
})
export class ResetformService {

  	constructor() { }

	reset(form: any) {
		form.reset();
		form.setValidators(null);
		form.setErrors({ 'invalid' : true })
		Object.keys(form.controls).forEach(key => {
			form.get(key).setErrors(null)
		});
		
	}

}
