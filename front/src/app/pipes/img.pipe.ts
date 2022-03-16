import { Pipe, PipeTransform } from '@angular/core';

import { DomSanitizer, } from '@angular/platform-browser';

@Pipe({
  	name: 'imgpipe'
})
export class ImgPipe implements PipeTransform {

	constructor(
		private domSanitizer: DomSanitizer
	) 	{

	}

	transform(payload: any): any[] {
		
		let TYPED_ARRAY = new Uint8Array(payload.data)
		
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
        }, '')
		
		return [STRING_CHAR];
	}

}

@Pipe({
	name: 'imgpipes'
})
export class imgpipes implements PipeTransform {

  constructor(
	  private domSanitizer: DomSanitizer
  ) 	{

  }

  transform(payload: any): any[] {
	  let TYPED_ARRAY = new Uint8Array(payload.data)
	  
	  const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
		  return data + String.fromCharCode(byte);
	  }, '')
	  
	  return [STRING_CHAR];
  }

}