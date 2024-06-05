import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCuponesUserPage } from './list-cupones-user.page';

const routes: Routes = [
  {
    path: '',
    component: ListCuponesUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCuponesUserPageRoutingModule {}
