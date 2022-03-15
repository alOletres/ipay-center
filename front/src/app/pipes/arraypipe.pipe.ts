import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraypipe'
})
export class ArraypipePipe implements PipeTransform {

	// transform(value: unknown, ...args: unknown[]): unknown {
	// 	return null;

		
	// }

	transform(objects : any = []) {
		console.log(objects);
		
		return Object.values(objects);
	  }

}
