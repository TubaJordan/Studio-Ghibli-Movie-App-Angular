import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

import { RouterModule, Routes } from '@angular/router';

import { MatIconModule } from "@angular/material/icon";
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { DirectorViewComponent } from './director-view/director-view.component';
import { GenreViewComponent } from './genre-view/genre-view.component';
import { SummaryViewComponent } from './summary-view/summary-view.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { FavoriteMovieCardComponent } from './favorite-movie-card/favorite-movie-card.component';
import { MatSelectModule } from "@angular/material/select";

import { NgSelectModule } from '@ng-select/ng-select';


const appRoutes: Routes = [
  { path: "welcome", component: WelcomePageComponent },
  { path: "movies", component: MovieCardComponent },
  { path: "profile-view", component: ProfileViewComponent },
  { path: "", redirectTo: "welcome", pathMatch: "prefix" },
];


@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserLoginFormComponent,
    MovieCardComponent,
    WelcomePageComponent,
    NavbarComponent,
    ProfileViewComponent,
    DeleteUserComponent,
    DirectorViewComponent,
    GenreViewComponent,
    SummaryViewComponent,
    UpdateUserComponent,
    FavoriteMovieCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    NgSelectModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
