import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreViewComponent } from './genre-view.component';

describe('GenreViewComponent', () => {
  let component: GenreViewComponent;
  let fixture: ComponentFixture<GenreViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenreViewComponent]
    });
    fixture = TestBed.createComponent(GenreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
