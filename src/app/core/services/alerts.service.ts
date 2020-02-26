import { Injectable, OnDestroy, Type } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { MatSnackBarModule, MatSnackBarConfig, MatSnackBarDismiss, MatSnackBar} from '@angular/material/snack-bar';
import { delay, filter, map, take, takeUntil, tap } from 'rxjs/operators';


export interface AlertQueueItem {
  isDisplayed: boolean;
  message?: string;
  component?: any;
  data?: any;
  configParams?: MatSnackBarConfig;
}

// NOTE!! Every call to start an alert has to be wrapped in a setTimeout with 0-delay like this:
// setTimeout(() => { this.alertService.queueComponentAlert(MyComponent); });
// This defers to queue loading, which is AFTER parent component ready, so doesn't throw ordering error.

@Injectable({
  providedIn: 'root',
})
export class AlertsService implements OnDestroy {
  private readonly queue = new BehaviorSubject<AlertQueueItem[]>([]);
  private readonly queue$ = this.queue.asObservable();
  private readonly ngDestroy = new Subject;

  constructor(private matSnackBar: MatSnackBar) {
    const that = this;
    // Dispatch all queued items individually
    this.queue$
      .pipe(
        filter(queue => queue.length > 0 && !queue[0].isDisplayed),
        tap(() => {
          const updatedQueue = this.queue.value;
          console.log("UPDATED QUEUE IS: ", updatedQueue);
          updatedQueue[0].isDisplayed = true;
          this.queue.next(updatedQueue); // push updated queue
        }),
        map(queue => queue[0]), // reverse
        takeUntil(this.ngDestroy)
      )
      .subscribe(alert => {
        console.log("ALERT ITEM IS: ", alert);
        const alertData = alert.data || {};
        const data = { data: Object.assign({message: "YEEEE"}, alertData)};
        // Component based custom alert with custom data fields
        if(alert.component) {
          matSnackBar.openFromComponent(alert.component, data);
        }
        // Default alert with message/buttontext/configs
        else {
          this.removeClosedAlert(
            matSnackBar
              .open(alert.message, 'OK', {duration: that.getDuration(alert.configParams)})  // other configs
              .afterDismissed()
          );
        }
      });
  }

  ngOnDestroy() {
    this.queue.next([]);
    this.queue.complete();
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  queueAlert(message: string, configParams?: MatSnackBarConfig) {
    this.queue.next(
      this.queue.value.concat([{isDisplayed: false, message: message, component: null, data: null, configParams: configParams}])
    );
  }
  // NOTE!! Every call of this function has to be wrapped in a setTimeout with 0-delay like this:
  // setTimeout(() => { this.alertService.queueComponentAlert(MyComponent); });
  // This defers to queue loading, which is AFTER parent component ready, so doesn't throw ordering error.
  queueComponentAlert(component: any, data?: any, configParams?: MatSnackBarConfig) {
    this.queue.next(
      this.queue.value.concat([{isDisplayed: false, message: null, component: component, data: data, configParams: configParams}])
    );
  }

  private getDuration(configParams?: MatSnackBarConfig) {
    const defaultMS = 10000;  // 10 sec
    return (configParams && configParams.duration ? configParams.duration : defaultMS);
  }

  private removeClosedAlert(closed: Observable<MatSnackBarDismiss>) {
    closed
      .pipe(
        delay(1000),
        take(1)
      )
      .subscribe(() => {
        const updatedQueue = this.queue.value;
        if(updatedQueue[0].isDisplayed) {
          updatedQueue.shift();
        }
        this.queue.next(updatedQueue);
      });
  }

  // Dispatch actions when an alert is already shown
  // private triggerAction(configParams?: MatSnackBarConfig) {
  //   if(configParams && configParams.triggerAction) {
  //     if(configParams.triggerAction === 'SOME_ACTION') {
  //       this.store.dispatch(new SomeAction());
  //     }
  //   }
  // }
}
