import { Component, Input, OnInit } from '@angular/core';
import { Observable, take, catchError, throwError, Subscription } from 'rxjs';
import { Status } from './status.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit {
  @Input() observable?: Observable<any>;
  @Input() size: number = 40;
  @Input() margin: string = '2rem';

  public status: Status = Status.NotStarted;

  constructor() {}

  ngOnInit(): void {
    // this.trigger(this.observable);
  }

  private _subscription?: Subscription;

  /** If loading is already in progress, it will cancel previus subscription and start a new one.
   * Normal trigger will ignore duplicate requests.
   */
  triggerOverride(observable?: Observable<any>) {
    if (observable && this._subscription && this.status === Status.Loading) {
      this._subscription.unsubscribe();
      this.status = Status.NotStarted;
    }
    this.trigger(observable);
  }

  trigger(observable?: Observable<any>) {
    if (this.status === Status.Loading) {
      console.warn('Cannot trigger this action, because its already running');
      return;
    }
    this.status = Status.Loading;
    console.log(observable);
    if (!observable) {
      this.status = Status.Success;
      return;
    }

    this._subscription = observable
      .pipe(
        take(1),
        catchError((error: any) => {
          this.status = Status.Failed;
          console.error('Error fetching data:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        complete: () => {
          this.status = Status.Success;
        },
      });
  }

  get Success(): boolean {
    return this.status === Status.Success;
  }
  get Error(): boolean {
    return this.status === Status.Failed;
  }
  get NotStarted(): boolean {
    return this.status === Status.NotStarted;
  }
  get Loading(): boolean {
    return this.status === Status.Loading;
  }
}
