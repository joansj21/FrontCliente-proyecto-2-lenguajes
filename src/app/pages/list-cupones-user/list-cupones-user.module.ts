import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCuponesUserPageRoutingModule } from './list-cupones-user-routing.module';

import { ListCuponesUserPage } from './list-cupones-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCuponesUserPageRoutingModule
  ],
  declarations: [ListCuponesUserPage]
})
export class ListCuponesUserPageModule {}
