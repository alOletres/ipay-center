import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public isAsyncOperationRunning$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}
}
