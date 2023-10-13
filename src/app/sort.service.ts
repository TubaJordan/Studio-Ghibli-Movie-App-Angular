import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SortService {
  private sortOrder = new BehaviorSubject<string>('A-Z');
  sortOrder$ = this.sortOrder.asObservable();

  changeSortOrder(order: string) {
    this.sortOrder.next(order);
  }

}