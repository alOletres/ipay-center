import { Component, OnInit } from '@angular/core';
import { BarkotaService } from './../../services/barkota.service'
@Component({
  selector: 'app-tellerpages',
  templateUrl: './tellerpages.component.html',
  styleUrls: ['./tellerpages.component.scss']
})
export class TellerpagesComponent implements OnInit {

	constructor(private http_barko : BarkotaService) { }

	ngOnInit() {
		
	}

}
