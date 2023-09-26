import { Injectable } from '@angular/core';

import { catchError } from "rxjs/internal/operators";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";

const apiURL = "https://moviesapi-4d4b61d9048f.herokuapp.com/";

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  constructor(private http: HttpClient) {
  }

  //user registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiURL + "users", userDetails).pipe(
      catchError(this.handleError)
    )
  }

  //user login
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiURL + "login", userDetails).pipe(
      catchError(this.handleError)
    )
  }

  //get all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiUrl + "movies", {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //get a single movie
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movies/" + title, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //get one director
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movie/director/" + directorName, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //get one genre
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movie/genre/" + genreName, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //get user
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user;
  }

  //get favorite movies
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(map(this.extractResponseData), map((data) => data.FavoriteMovies), catchError(this.handleError))
  }

  //add to favorites
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  //edit user
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //delete user
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(catchError(this.handleError))
  }

  //delete favorite movie
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) { // only splice array when item is found
      user.FavoriteMovies.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    }
    else if (error.error.errors) {
      return throwError(() => new Error(error.error.errors[0].msg));
    }
    else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
