import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { WrapperComponent } from "./../pages/wrapper/wrapper.component";

@Injectable({
  providedIn: 'root'
})
export class DeActivateGuard implements CanDeactivate<WrapperComponent> {

  canDeactivate() {
    // component: unknown,
    // currentRoute: ActivatedRouteSnapshot,
    // currentState: RouterStateSnapshot,
    // nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return sessionStorage.getItem('userLog') ? false : true;
  }
  
}
