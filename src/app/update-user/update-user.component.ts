import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})

export class UpdateUserComponent implements OnInit {
  submittedData: any = {};
  @Input() updatedUserData = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    birthDate: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void { }

  reviewData(): void {
    const oldData = this.updatedUserData;
    if (oldData.username) {
      this.submittedData.username = oldData.username.trim();
    }
    if (oldData.password) {
      this.submittedData.password = oldData.password.trim();
    }
    if (oldData.email) {
      this.submittedData.email = oldData.email.trim();
    }
    if (oldData.birthDate) {
      this.submittedData.birthDate = oldData.birthDate;
    }
  }

  updateUser(): void {
    if (this.updatedUserData.password !== this.updatedUserData.confirmPassword) {
      this.snackBar.open('Passwords do not match, please try again', 'OK', {
        duration: 3000,
      });
      return;
    }
    this.reviewData();
    this.fetchApiData.editUser(this.submittedData).subscribe(
      () => {
        const loginData = {
          username: this.submittedData.Username || this.updatedUserData.username,
          password: this.submittedData.Password || this.updatedUserData.password,
        };
        this.fetchApiData.login(loginData).subscribe(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.dialogRef.close();
          this.snackBar.open('User updated successfully!', 'OK', {
            duration: 3000,
          });
          this.router.navigate(['movies']);
        }, loginError => {
          this.snackBar.open(loginError, 'OK', {
            duration: 2000,
          });
        });
      },
      (updateError) => {
        this.snackBar.open(updateError, 'OK', {
          duration: 2000,
        });
      }
    );
  }

}