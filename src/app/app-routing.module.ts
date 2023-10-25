/**
 * Angular module for handling application routing.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Define the application routes
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure the router module with the defined routes
  exports: [RouterModule] // Exports RouterModule to make router directives available to the app.
})

/**
 * AppRoutingModule
 * This module provides routing configuration for the application.
 */
export class AppRoutingModule { }