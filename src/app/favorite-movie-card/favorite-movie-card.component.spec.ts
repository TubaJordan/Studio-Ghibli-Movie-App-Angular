import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteMovieCardComponent } from './favorite-movie-card.component';

describe('FavoriteMovieCardComponent', () => {
  let component: FavoriteMovieCardComponent;
  let fixture: ComponentFixture<FavoriteMovieCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteMovieCardComponent]
    });
    fixture = TestBed.createComponent(FavoriteMovieCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
