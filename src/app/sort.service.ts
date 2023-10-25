import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for managing sort order preferences.
 */
@Injectable({
  providedIn: 'root'
})
export class SortService {

  /**
   * A BehaviorSubject to hold the current sort order value.
   * It starts with a default value of 'A-Z'.
   * @private
   */
  private sortOrder = new BehaviorSubject<string>('A-Z');

  /**
   * An Observable that exposes the current sort order.
   * External components can subscribe to this to be notified 
   * of changes in the sort order.
   */
  sortOrder$ = this.sortOrder.asObservable();

  /**
   * Updates the sort order.
   * @param {string} order - The new sort order value.
   */
  changeSortOrder(order: string) {
    this.sortOrder.next(order);
  }

}