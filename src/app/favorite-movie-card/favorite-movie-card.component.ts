import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { DirectorViewComponent } from '../director-view/director-view.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { SummaryViewComponent } from '../summary-view/summary-view.component';

@Component({
  selector: 'app-favorite-movie-card',
  templateUrl: './favorite-movie-card.component.html',
  styleUrls: ['./favorite-movie-card.component.css']
})

export class FavoriteMovieCardComponent implements OnInit {
  @Input() movie: any;
  @Output() movieRemoved = new EventEmitter<string>();

  genre: any = {};
  director: any = {};
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getFavorites();
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

      console.log("API Response for Director (from FavoriteMovieCard):", resp);
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

  removeFromFavorites(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(
      (resp: any) => {
        this.favorites = this.favorites.filter(favId => favId !== id);
        const movieTitle = this.movie.title;
        this.snackBar.open(`${movieTitle} was removed from your list of favorites`, "OK", {
          duration: 3000,
          panelClass: ["custom-snackbar"],
          verticalPosition: "bottom",
          horizontalPosition: "center",
        });
        this.movieRemoved.emit(id);
      },
      (resp) => {
        this.snackBar.open(resp, "ok", {
          duration: 2000,
        });
      }
    );
  }

  isFavorite(id: string): boolean {
    return Array.isArray(this.favorites) && this.favorites.includes(id);
  }

  getFavorites(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favorites = resp.favoriteMovies;
    });
  }

}