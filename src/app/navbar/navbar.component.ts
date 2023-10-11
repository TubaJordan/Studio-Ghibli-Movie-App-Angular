import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SortService } from '../sort.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  public username: string = "";
  public imagePath: string = "/assets/top-logo.png"

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private sortService: SortService,
  ) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem("user")!).username;
  }

  navigateToMovieView() {
    this.router.navigate(["movies"]);
  }

  navigateToProfileView() {
    this.router.navigate(["profile-view"]);
  }

  logout() {
    this.dialog.closeAll();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.router.navigate(["welcome"]);
  }

  onSortChange(event: any) {
    const selectedValue = event.target.value;
    this.sortService.changeSortOrder(selectedValue);
  }

}
