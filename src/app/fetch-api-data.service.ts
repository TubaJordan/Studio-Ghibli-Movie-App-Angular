import { Injectable } from '@angular/core';
import { catchError } from "rxjs";
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
    return this.http.get(apiURL + "movies", {
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
    return this.http.get(apiURL + "movies/director/" + directorName, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //get one genre
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movies/genre/" + genreName, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //get user
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + `users/${user}`, {
      headers: new HttpHeaders({
        Authorization: "Bearer" + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //get favorite movies
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    console.log("getFavoriteMovies", apiURL + "users/" + user.username)

    return this.http.get(apiURL + 'users/' + user.username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //add to favorites
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem('token');

    console.log("user log", user);
    console.log("user.username", user.username);

    console.log("URL test", (apiURL + "users/" + user.username + "/movies/" + movieId));

    return this.http.post(apiURL + "users/" + user.username + "/movies/" + movieId, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //edit user
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiURL + 'users/' + user.username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  // delete user
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    console.log("user log", user);
    console.log("user.username log", user.username);
    console.log("Is the URL correct", (apiURL + 'users/' + user.username));
    console.log("token", token);
    console.log("type check, user.username", typeof user.username)
    console.log("type check, user", typeof user)

    return this.http.delete(apiURL + 'users/' + user.username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe((map(this.extractResponseData), catchError(this.handleError)));
  }


  //delete favorite movie
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiURL + "users/" + user + "/movies/" + movieId, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
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
