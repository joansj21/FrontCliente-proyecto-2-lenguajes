import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCuponesUserPage } from './list-cupones-user.page';

describe('ListCuponesUserPage', () => {
  let component: ListCuponesUserPage;
  let fixture: ComponentFixture<ListCuponesUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCuponesUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
