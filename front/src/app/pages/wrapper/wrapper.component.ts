import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { Router } from "@angular/router";
@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html',
	styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

	@ViewChild('sidenav') sidenav!: MatSidenav;
	public isShowSidebar: boolean;
	public mobileQuery: MediaQueryList;
	private mobileQueryListener: () => void;

	constructor(
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher,
		private router: Router
	) {
		this.mobileQuery = media.matchMedia('(max-width: 1024px)');
		this.mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this.mobileQueryListener);

		this.isShowSidebar = !this.mobileQuery.matches;
	}

	ngOnInit(){
		// if(sessionStorage.getItem('userLog') != null){
		// 	this.router.navigate(['/main'])
		// }else{
		// 	this.router.navigate(['/login'])
		// }
	}

	public ngOnDestroy(): void {
		this.mobileQuery.removeListener(this.mobileQueryListener);

		this.sidenav.close();
	}

}
