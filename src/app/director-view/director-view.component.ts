import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component responsible for displaying details of a director.
 */
@Component({
  selector: 'app-director-view',
  templateUrl: './director-view.component.html',
  styleUrls: ['./director-view.component.css']
})

export class DirectorViewComponent {

  /**
   * Creates an instance of DirectorViewComponent.
   * 
   * @param data - Object containing director details.
   * @property title - The title of the movie related to this director.
   * @property name - Name of the director.
   * @property bio - Biography of the director.
   * @property birthyear - Birth year of the director.
   * @property deathyear - Death year of the director.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      name: string;
      bio: string;
      birthyear: string;
      deathyear: string;
    }
  ) { }

}
