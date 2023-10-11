import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void { }

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

  closeDialog(): void {
    this.dialogRef.close();
  }

}