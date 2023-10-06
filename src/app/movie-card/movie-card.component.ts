import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { DirectorViewComponent } from '../director-view/director-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {

  movies: any[] = [];
  genre: any = "";
  director: any = "";
  movie: any = "";
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;

      this.movies.sort((a: any, b: any) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB);
      })


      console.log(this.movies);
      return this.movies;
    });
  }

  getFavorites(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favorites = resp;
      return this.favorites;
    })
  }

  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
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

  openSummary(title: string): void {
    this.fetchApiData.getOneMovie(title).subscribe((resp: any) => {
      this.movie = resp;
      this.dialog.open(SummaryViewComponent, {
        data: {
          title: title,
          summary: this.movie.description,
        },
      });
    });
  }

  addToFavorites(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe(
      (resp: any) => {
        this.snackBar.open("movie has been added", "ok", {
          duration: 3000,
        });
        this.getFavorites();
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
        this.snackBar.open("movie removed from list", "ok", {
          duration: 3000,
        });
        this.getFavorites();
      },
      (resp) => {
        this.snackBar.open(resp, "ok", {
          duration: 2000,
        });
      }
    );
  }

}