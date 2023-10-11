import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { DirectorViewComponent } from '../director-view/director-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';
import { SortService } from '../sort.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})

export class MovieCardComponent implements OnInit {
  @Input() movie: any

  @Input() fetchAll: boolean = true;

  movies: any[] = [];
  genre: any = "";
  director: any = "";
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private sortService: SortService,
  ) { }

  ngOnInit(): void {
    if (this.fetchAll) {
      this.getMovies();
    }
    this.getFavorites();

    this.sortService.sortOrder$.subscribe(order => {
      this.sortMoviesBasedOnMethod(order);
    });
  }

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

  getFavorites(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favorites = resp.favoriteMovies;
    });
  }

  isFavorite(id: string): boolean {
    return Array.isArray(this.favorites) && this.favorites.includes(id);
  }


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

  openDirector(name: string, title: string): void {
    this.fetchApiData.getOneDirector(name).subscribe((resp: any) => {
      this.director = resp;

      console.log("API Response for Director (from MovieCard):", resp);
      console.log("this.director", this.director);

      if (this.director.director.deathyear === 0) {
        this.director.director.deathyear = "Still alive"
      }

      console.log("Director Data being sent to dialog:", {
        title: title,
        name: name,
        bio: this.director.director.bio,
        birthyear: this.director.director.birthyear,
        deathyear: this.director.director.deathyear
      });

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