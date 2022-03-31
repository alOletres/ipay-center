import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export default class SocketService {

	constructor(private socket : Socket ) {
	}

	eventListener(eventName: string) {
		return this.socket.fromEvent(eventName)
	}
  
	sendEvent(eventName: string, data: any) {
		return this.socket.emit(eventName, data)
	}
  
}
