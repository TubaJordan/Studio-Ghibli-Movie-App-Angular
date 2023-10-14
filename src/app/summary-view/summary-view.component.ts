import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for the summary view.
 */
@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.css']
})

export class SummaryViewComponent {

  /**
   * Constructor for the SummaryViewComponent.
   * @param data - Injected data object containing movie details.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      summary: string;
      release: number;
    }
  ) { }

}
