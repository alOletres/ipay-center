import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'filter'
})
export class FilterPipe implements PipeTransform {

	transform(items: any[], searchTxt: string): any[] {
		if(!items || !items.length) return items;
		if(!searchTxt || !searchTxt.length) return items;
		return items.filter(item => {
			return item.PRODUCTNAME.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1;
		});
	}

}
