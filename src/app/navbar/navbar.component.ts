import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SortService } from '../sort.service';

/**
 * Component for the navigation bar.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  /** Holds the username of the logged-in user. */
  public username: string = "";

  /** Path to the logo image displayed in the navbar. */
  public imagePath: string = "/assets/top-logo.png"

  /**
   * Constructor for the NavbarComponent.
   *
   * @param router Service to handle routing.
   * @param dialog Service to handle dialog interactions.
   * @param sortService Service for sorting movies.
   */
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private sortService: SortService,
  ) { }

  /**
   * Angular lifecycle hook that initializes the component.
   * This method is called once the component is initialized.
   */
  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem("user")!).username;
  }

  /**
   * Navigate to the movie view.
   */
  navigateToMovieView() {
    this.router.navigate(["movies"]);
  }

  /**
   * Navigate to the profile view.
   */
  navigateToProfileView() {
    this.router.navigate(["profile-view"]);
  }

  /**
   * Logout the user, remove their details from local storage, and navigate to the welcome page.
   */
  logout() {
    this.dialog.closeAll();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.router.navigate(["welcome"]);
  }

  /**
   * Change the sort order based on user selection.
   * 
   * @param event Event that contains the selected sort order.
   */
  onSortChange(event: any) {
    const selectedValue = event.target.value;
    this.sortService.changeSortOrder(selectedValue);
  }

}
