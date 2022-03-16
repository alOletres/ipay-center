import { Injectable } from '@angular/core';
// import { io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export default class SocketService {

	constructor(private socket : Socket ) {
		// this.socket = io("http://localhost:8080")
		
		// this.socket = io("https://ipaypaymentcenter.com:8080")
	}
	/**send message to server */
	/** emit client or send message to server  */
	// sendEvent(eventName:any, data:any){
		
	// 	return this.socket.emit(eventName, data)
	// }

	// async eventListener(eventName:any){
		
	// 	return new Promise((resolve)=>{
	// 		this.socket.on(eventName, (data:any)=> {
		
	// 			resolve(data)
	// 		})
	// 	})
		
	// }

	eventListener(eventName: string) {
		return this.socket.fromEvent(eventName)
	}
  
	sendEvent(eventName: string, data: any) {
		return this.socket.emit(eventName, data)
	}
  
}
