import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  waitNSeconds(n: number): Observable<void> {
    return of(null).pipe(delay(n * 1000));
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'success', text: message});
    this.waitNSeconds(3).subscribe();
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'error', text: message});
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
