import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  setLoadingState(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}