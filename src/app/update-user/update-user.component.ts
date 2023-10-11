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
    Username: '',
    Password: '',
    Name: '',
    Email: '',
    Birthday: '',
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
    if (oldData.Username) {
      this.submittedData.Username = oldData.Username;
    }
    if (oldData.Password) {
      this.submittedData.Password = oldData.Password;
    }
    if (oldData.Name) {
      this.submittedData.Name = oldData.Name;
    }
    if (oldData.Email) {
      this.submittedData.Email = oldData.Email;
    }
    if (oldData.Birthday) {
      this.submittedData.Birthday = oldData.Birthday;
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

        if (this.updatedUserData.Username) {
          localStorage.setItem('username', this.updatedUserData.Username);
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