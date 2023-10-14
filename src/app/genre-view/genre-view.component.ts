import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @description
 * Component to display the details of a movie genre.
 */
@Component({
  selector: 'app-genre-view',
  templateUrl: './genre-view.component.html',
  styleUrls: ['./genre-view.component.css']
})

export class GenreViewComponent {

  /**
   * @description
   * Constructs an instance of the GenreViewComponent.
   * 
   * @param data 
   * Data passed into the dialog, containing information about the movie genre.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      name: string;
      description: string;
    }
  ) { }

}
