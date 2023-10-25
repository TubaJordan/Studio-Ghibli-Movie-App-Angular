import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * User Login Form Component
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css']
})
export class UserLoginFormComponent implements OnInit {

  /** User login data */
  @Input() userData = { username: '', password: '' };

  /**
   * Constructor for the UserLoginFormComponent.
   * @param fetchApiData - Service to handle API data fetching.
   * @param dialogRef - Reference to the login dialog.
   * @param snackBar - Service for displaying snack-bar notifications.
   * @param router - Angular Router for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  /**
   * Angular lifecycle hook that initializes the component.
   * This method is called once the component is initialized.
   */
  ngOnInit(): void {
  }

  /**
   * Handles the login of a user.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((data) => {
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token);
      localStorage.setItem('username', data.user.username)
      this.router.navigate(["movies"]);
      this.dialogRef.close();
      this.snackBar.open(`You've been logged in!`, "OK", {
        duration: 2000
      });
    }, () => {
      this.snackBar.open("Sorry, something went wrong. Please try again", "OK", {
        duration: 2000
      });
    })
  }
}