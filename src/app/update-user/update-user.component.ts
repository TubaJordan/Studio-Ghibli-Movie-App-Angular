import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})


export class UpdateUserComponent implements OnInit {
  submittedData: any = {};
  @Input() updatedUserData = {
    username: "",
    email: "",
    password: "",
    birthDate: "",
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  ngOnInit(): void { }

  reviewData(): void {
    const oldData = this.updatedUserData;
    if (oldData.username) {
      this.submittedData.Username = oldData.username;
    }
    if (oldData.email) {
      this.submittedData.Email = oldData.email;
    }
    if (oldData.password) {
      this.submittedData.Password = oldData.password;
    }
    if (oldData.birthDate) {
      this.submittedData.Birthday = oldData.birthDate;
    }
  }

  updateUser(): void {
    this.reviewData();
    this.fetchApiData.editUser(this.submittedData).subscribe(
      () => {
        this.dialogRef.close();
        this.snackBar.open('User updated successfully!', 'OK', {
          duration: 3000,
        });

        this.router.navigate(['movies']);

        if (this.updatedUserData.username) {
          localStorage.setItem('username', this.updatedUserData.username);
        }
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }

}
