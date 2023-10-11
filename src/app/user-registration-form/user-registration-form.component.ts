import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.css'],
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { username: '', password: '', confirmPassword: '', email: '', birthDate: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  registerUser(): void {
    if (this.userData.password !== this.userData.confirmPassword) {
      this.snackBar.open('Passwords do not match, please try again', 'OK', {
        duration: 3000,
      });
      return;
    }
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      this.fetchApiData.userLogin({ username: this.userData.username, password: this.userData.password })
        .subscribe((loginResponse) => {
          localStorage.setItem('token', loginResponse.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.user));
          this.dialogRef.close();
          this.snackBar.open("You have been successfully registered and logged in!", 'OK', {
            duration: 3000
          });
          this.router.navigate(['movies']);
        });
    }, (error) => {
      console.error("error response", error);
      const errorMessage = error.error || "An error has occurred. Please try again.";
      this.snackBar.open(errorMessage, 'OK', {
        duration: 3000
      });
    });
  }
}

