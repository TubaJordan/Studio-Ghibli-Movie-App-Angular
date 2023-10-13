import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { SortService } from '../sort.service';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})

export class ProfileViewComponent implements OnInit {

  user: any = {};
  updatedUser: any = {};
  movies: any[] = [];
  favoriteMoviesByTitle: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
    private sortService: SortService,
  ) { }

  favoriteMovies: any[] = [];

  ngOnInit(): void {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      this.user = JSON.parse(localStorage.getItem("user")!);
      this.getUserInfo();
    } else {
      this.router.navigate(["welcome"]);
    }

    this.sortService.sortOrder$.subscribe(order => {
      this.sortFavoritesBasedOnMethod(order);
    });
  }

  sortFavoritesBasedOnMethod(order: string) {
    switch (order) {
      case 'A-Z':
        this.favoriteMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        this.favoriteMovies.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'genre':
        this.favoriteMovies.sort((a, b) => a.genre.name.localeCompare(b.genre.name));
        break;
      case 'director':
        this.favoriteMovies.sort((a, b) => a.director.name.localeCompare(b.director.name));
        break;
      case 'releaseYearOldToNew':
        this.favoriteMovies.sort((a, b) => a.releaseYear - b.releaseYear);
        break;
      case 'releaseYearNewToOld':
        this.favoriteMovies.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      default:
        break;
    }
  }

  onSortChange(event: any) {
    const selectedValue = event.target.value;
    this.sortService.changeSortOrder(selectedValue);
  }

  getMovieByTitle(movieTitle: string): any {
    return this.movies.find((movie: any) => movie.title === movieTitle);
  }

  generateFavoritesList(): void {
    if (this.user && this.user.favoriteMovies) {
      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        if (resp && Array.isArray(resp)) {
          const movies = resp;
          this.favoriteMovies = movies.filter((movie: any) =>
            this.user.favoriteMovies.includes(movie._id)
          );
        } else {
          console.error('Error: API response is undefined, null, or not an array.');
        }
      });
    }
  }

  getUserInfo(): void {
    this.fetchApiData.getOneUser().subscribe(
      (resp: any) => {
        if (resp) {
          this.user = resp;
          this.generateFavoritesList();
        } else {
          console.error('Error: Response from getOneUser does not contain the expected user property.');
        }
      },
      (error) => {
        console.error('Error fetching user information:', error);
      }
    );
  }

  handleMovieRemoved(removedMovieId: string) {
    this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== removedMovieId);
  }

  openUserUpdateDialog(): void {
    this.dialog.open(UpdateUserComponent, {
      width: "350px",
    });
  }

  openDeleteUserDialog(): void {
    this.dialog.open(DeleteUserComponent, {
      width: "350px",
    });
  }

}