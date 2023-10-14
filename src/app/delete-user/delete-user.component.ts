import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Component responsible for handling the user deletion functionality.
 */
@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  /**
   * Creates an instance of DeleteUserComponent.
   * @param fetchApiData - Service responsible for fetching data from the API.
   * @param dialogRef - Reference to the current dialog.
   * @param snackBar - Service used to display a notification bar.
   * @param router - Service used for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  /**
   * Angular lifecycle hook that initializes the component.
   * This method is called once the component is initialized.
   */
  ngOnInit(): void { }

  /**
   * Deletes the user and handles the subsequent UI changes.
   */
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(
      () => {
        localStorage.clear();
        this.dialogRef.close();
        this.router.navigate(["welcome"]);
        this.snackBar.open("Your account has been deleted", "OK", {
          duration: 3000,
        });
      },
      (result) => {
        console.error("Error response from server:", result);
        this.snackBar.open("Error has occurred in the dialog", "OK", {
          duration: 2000,
        });
      }
    );
  }

  /**
   * Closes the current dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

}