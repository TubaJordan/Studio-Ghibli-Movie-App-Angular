/**
 * Angular main component module.
 */
import { Component } from '@angular/core';

/**
 * Component decorator providing metadata about the AppComponent.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * AppComponent class which serves as the main app component.
 */
export class AppComponent {
  title = 'Ghibli Movie Collection'; // The title property of the app component
}