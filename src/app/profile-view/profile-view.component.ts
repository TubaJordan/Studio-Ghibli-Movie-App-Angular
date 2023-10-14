import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { SortService } from '../sort.service';

/**
 * Component for the profile view.
 */
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})

export class ProfileViewComponent implements OnInit {

  /** Component state properties */
  user: any = {};
  updatedUser: any = {};
  movies: any[] = [];
  favoriteMoviesByTitle: any[] = [];
  favoriteMovies: any[] = [];

  /**
   * Constructor for the ProfileViewComponent.
   * @param fetchApiData - Service to fetch data from API
   * @param dialog - Material dialog service
   * @param router - Angular router
   * @param snackBar - Material snackbar service
   * @param sortService - Service to handle sorting logic
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
    private sortService: SortService,
  ) { }

  /**
   * Angular lifecycle hook that initializes the component.
   * This method is called once the component is initialized.
   */
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

  /**
   * Method to sort favorite movies based on provided order.
   * @param order - String defining the order type
   */
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

  /** Event handler for sort change event */
  onSortChange(event: any) {
    const selectedValue = event.target.value;
    this.sortService.changeSortOrder(selectedValue);
  }

  /**
   * Method to get movie by title.
   * @param movieTitle - Title of the movie to find.
   */
  getMovieByTitle(movieTitle: string): any {
    return this.movies.find((movie: any) => movie.title === movieTitle);
  }

  /** Method to generate list of favorite movies */
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

  /** Method to get user information */
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

  /**
   * Method to handle removal of movie from favorites.
   * @param removedMovieId - ID of the movie to remove.
   */
  handleMovieRemoved(removedMovieId: string) {
    this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== removedMovieId);
  }

  /** Method to open user update dialog */
  openUserUpdateDialog(): void {
    this.dialog.open(UpdateUserComponent, {
      width: "350px",
    });
  }

  /** Method to open delete user dialog */
  openDeleteUserDialog(): void {
    this.dialog.open(DeleteUserComponent, {
      width: "350px",
    });
  }

}