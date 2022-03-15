import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-branchmaster',
  templateUrl: './branchmaster.component.html',
  styleUrls: ['./branchmaster.component.scss']
})
export class BranchmasterComponent implements OnInit {
    branchData:any
    fbranchData:any
    ibarangayData :any
	tellerData : any
	databranchs : any
	type : any
	dataBibarangayTellers : any
    
	constructor() { }

    async ngOnInit() {

		this.type = atob(sessionStorage.getItem('type'));		
    
	}

}
