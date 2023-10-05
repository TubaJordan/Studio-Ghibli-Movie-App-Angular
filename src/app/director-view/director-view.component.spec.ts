import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorViewComponent } from './director-view.component';

describe('DirectorViewComponent', () => {
  let component: DirectorViewComponent;
  let fixture: ComponentFixture<DirectorViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorViewComponent]
    });
    fixture = TestBed.createComponent(DirectorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
