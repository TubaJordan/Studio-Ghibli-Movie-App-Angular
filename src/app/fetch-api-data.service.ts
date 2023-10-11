import { Injectable } from '@angular/core';
import { catchError } from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, take, tap } from "rxjs/operators";

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

    console.log("within getAllMovies function", apiURL + "movies")

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
    const url = apiURL + "users/" + user.username;

    const headers = new HttpHeaders({
      Authorization: "Bearer " + token,
    });

    return this.http.get(url, { headers }).pipe(
      tap((response: any) => {
        console.log("API Response:", response);
      }),
      map(this.extractResponseData),
      catchError((error) => {
        console.error("API Error:", error);
        return this.handleError(error);
      })
    );
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

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });

    return this.http.delete(apiURL + 'users/' + user.username, { headers: headers, responseType: 'text' })
      .pipe(take(1), catchError(this.handleError));
  }


  //add to favorites
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });

    return this.http.post(apiURL + "users/" + user.username + "/movies/" + movieId, {}, { headers: headers })
      .pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });

    return this.http.delete(apiURL + "users/" + user.username + "/movies/" + movieId, { headers: headers })
      .pipe(map(this.extractResponseData), catchError(this.handleError))
  }



  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // private handleError(error: HttpErrorResponse): any {
  //   if (error.error instanceof ErrorEvent) {
  //     console.error('Some error occurred:', error.error.message);
  //   }
  //   else if (error.error.errors) {
  //     return throwError(() => new Error(error.error.errors[0].msg));
  //   }
  //   else {
  //     console.error(
  //       `Error Status code ${error.status}, ` +
  //       `Error body is: ${error.error}`);
  //   }
  //   return throwError(() => new Error('Something bad happened; please try again later.'));
  // }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client side error:', error.error.message);
    } else {
      // Backend error. Check if there are specific errors, and log them.
      if (error.error.errors) {
        console.error('Backend error details:', error.error.errors);
        return throwError(() => new Error(error.error.errors[0].msg));
      } else {
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
    }

    // Provide a user-friendly error message for the UI:
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


}
