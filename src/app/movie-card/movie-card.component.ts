import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { DirectorViewComponent } from '../director-view/director-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';
import { SortService } from '../sort.service';

/**
 * Component for displaying a movie card.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})

export class MovieCardComponent implements OnInit {

  /** Input property for the movie data. */
  @Input() movie: any

  /** Input property to determine if all movies should be fetched. Default is true. */
  @Input() fetchAll: boolean = true;

  /** Array to store movies data. */
  movies: any[] = [];

  /** Stores the selected genre. */
  genre: any = "";

  /** Stores the selected director. */
  director: any = "";

  /** Array to store favorite movies. */
  favorites: any[] = [];

  /**
   * Constructor for the MovieCardComponent.
   *
   * @param fetchApiData Service for fetching API data.
   * @param dialog Service to handle dialog interactions.
   * @param snackBar Service to handle snackbar notifications.
   * @param router Service to handle routing.
   * @param sortService Service for sorting movies.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private sortService: SortService,
  ) { }

  /**
   * Angular lifecycle hook that initializes the component.
   * This method is called once the component is initialized.
   */
  ngOnInit(): void {
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      this.router.navigate(["welcome"]);
      return;
    }
    if (this.fetchAll) {
      this.getMovies();
    }
    this.getFavorites();

    this.sortService.sortOrder$.subscribe(order => {
      this.sortMoviesBasedOnMethod(order);
    });
  }

  /**
   * Sort movies based on a specific order.
   * 
   * @param order Sorting criteria.
   */
  sortMoviesBasedOnMethod(order: string) {
    switch (order) {
      case 'A-Z':
        this.movies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        this.movies.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'genre':
        this.movies.sort((a, b) => a.genre.name.localeCompare(b.genre.name));
        break;
      case 'director':
        this.movies.sort((a, b) => a.director.name.localeCompare(b.director.name));
        break;
      case 'releaseYearOldToNew':
        this.movies.sort((a, b) => a.releaseYear - b.releaseYear);
        break;
      case 'releaseYearNewToOld':
        this.movies.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      default:
        break;
    }
  }

  /**
   * Fetch all movies.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.sort((a: any, b: any) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB);
      })
      return this.movies;
    });
  }

  /**
   * Fetch favorite movies for the user.
   */
  getFavorites(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favorites = resp.favoriteMovies;
    });
  }

  /**
   * Determine if a movie is in the favorites list.
   * 
   * @param id Movie ID.
   * @returns True if movie is a favorite, false otherwise.
   */
  isFavorite(id: string): boolean {
    return Array.isArray(this.favorites) && this.favorites.includes(id);
  }

  /**
   * Display the genre details in a dialog.
   * 
   * @param name Genre name.
   * @param title Movie title.
   * @param description Genre description.
   */
  openGenre(name: string, title: string, description: string): void {
    this.fetchApiData.getOneGenre(name).subscribe((resp: any) => {
      this.genre = resp;
      this.dialog.open(GenreViewComponent, {
        data: {
          title: title,
          name: name[0].toUpperCase() + name.slice(1),
          description: description,
        },
      });
    });
  }

  /**
   * Display the director details in a dialog.
   * 
   * @param name Director name.
   * @param title Movie title.
   */
  openDirector(name: string, title: string): void {
    this.fetchApiData.getOneDirector(name).subscribe((resp: any) => {
      this.director = resp;
      if (this.director.director.deathyear === 0) {
        this.director.director.deathyear = "Still alive"
      }
      this.dialog.open(DirectorViewComponent, {
        data: {
          title: title,
          name: name,
          bio: this.director.director.bio,
          birthyear: this.director.director.birthyear,
          deathyear: this.director.director.deathyear,
        },
      });
    });
  }

  /**
   * Display movie summary in a dialog.
   * 
   * @param title Movie title.
   */
  openSummary(title: string): void {
    this.fetchApiData.getOneMovie(title).subscribe((resp: any) => {
      this.movie = resp;
      this.dialog.open(SummaryViewComponent, {
        data: {
          title: title,
          summary: this.movie.description,
          release: this.movie.releaseYear,
        },
      });
    });
  }

  /**
   * Add a movie to the favorites list.
   * 
   * @param id Movie ID.
   */
  addToFavorites(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe(
      (resp: any) => {
        this.favorites.push(id);
        const movieTitle = this.movies.find(movie => movie._id === id)?.title;
        this.snackBar.open(`${movieTitle} was added to your list of favorites`, "OK", {
          duration: 3000,
        });
      },
      (resp) => {
        this.snackBar.open(resp, "ok", {
          duration: 2000,
        });
      }
    );
  }

  /**
   * Remove a movie from the favorites list.
   * 
   * @param id Movie ID.
   */
  removeFromFavorites(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(
      (resp: any) => {
        this.favorites = this.favorites.filter(favId => favId !== id);
        const movieTitle = this.movies.find(movie => movie._id === id)?.title;
        this.snackBar.open(`${movieTitle} was removed from your favorites list`, "OK", {
          duration: 3000,
        });
      },
      (resp) => {
        this.snackBar.open(resp, "ok", {
          duration: 2000,
        });
      }
    );
  }

}