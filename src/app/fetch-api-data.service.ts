import { Injectable } from '@angular/core';
import { catchError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, take, tap } from "rxjs/operators";

// Constant representing the API's base URL.
const apiURL = "https://moviesapi-4d4b61d9048f.herokuapp.com/";

/**
 * Service decorator with a 'root' level provider. 
 * This makes the service a singleton.
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Service class to fetch data from the API.
 */
export class FetchApiDataService {

  /**
   * Constructor that injects the HttpClient.
   * @param {HttpClient} http HttpClient instance.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Method to register a new user.
   * @param {any} userDetails - The details of the user for registration.
   * @returns {Observable<any>} Observable containing the server response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiURL + "users", userDetails, { responseType: "text" }).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * Method to authenticate user login.
   * @param {any} userDetails - The details of the user for authentication.
   * @returns {Observable<any>} Observable containing the server response.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiURL + "login", userDetails).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * Fetches all movies.
   * @returns {Observable<any>} Observable containing the list of movies.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movies", {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Fetches a single movie by title.
   * @param {string} title - The title of the movie.
   * @returns {Observable<any>} Observable containing the movie details.
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movies/" + title, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Fetches details of a director by name.
   * @param {string} directorName - The name of the director.
   * @returns {Observable<any>} Observable containing the director details.
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movies/director/" + directorName, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Fetches details of a genre by name.
   * @param {string} genreName - The name of the genre.
   * @returns {Observable<any>} Observable containing the genre details.
   */
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiURL + "movies/genre/" + genreName, {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Fetches details of a user.
   * @returns {Observable<any>} Observable containing the user details.
   */
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const url = apiURL + "users/" + user.username;
    const headers = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    return this.http.get(url, { headers }).pipe(
      tap((response: any) => {
      }),
      map(this.extractResponseData),
      catchError((error) => {
        console.error("API Error:", error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Fetches favorite movies of a user.
   * @returns {Observable<any>} Observable containing the user's favorite movies.
   */
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiURL + 'users/' + user.username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Updates user details.
   * @param {any} updatedUser - The updated details of the user.
   * @returns {Observable<any>} Observable containing the server response.
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiURL + 'users/' + user.username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Authenticates user login.
   * @param {any} userData - The user data for authentication.
   * @returns {Observable<any>} Observable containing the server response.
   * @note This is a duplicate of userLogin method.
   */
  login(userData: any): Observable<any> {
    return this.http.post(apiURL + 'login', userData).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user.
   * @returns {Observable<any>} Observable containing the server response.
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });
    return this.http.delete(apiURL + 'users/' + user.username, { headers: headers, responseType: 'text' })
      .pipe(take(1), catchError(this.handleError));
  }

  /**
   * Adds a movie to user's favorites.
   * @param {string} movieId - The ID of the movie to be added.
   * @returns {Observable<any>} Observable containing the server response.
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });
    return this.http.post(apiURL + "users/" + user.username + "/movies/" + movieId, {}, { headers: headers })
      .pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Removes a movie from the user's favorites.
   * @param {string} movieId - The ID of the movie to be removed.
   * @returns {Observable<any>} Observable containing the server response.
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });
    return this.http.delete(apiURL + "users/" + user.username + "/movies/" + movieId, { headers: headers })
      .pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  /**
   * Extracts and returns data from the response.
   * @param {any} res - The response object.
   * @returns {any} The extracted data.
   * @private
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Central error handling method.
   * @param {HttpErrorResponse} error - The error object.
   * @returns {Observable<never>} Throws an observable error.
   * @private
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Client side error:', error.error.message);
    } else {
      if (error.error.errors) {
        console.error('Backend error details:', error.error.errors);
        return throwError(() => new Error(error.error.errors[0].msg));
      }
      else if (typeof error.error === 'string') {
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
        return throwError(() => new Error(error.error));
      } else {
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
