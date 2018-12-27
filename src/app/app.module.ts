import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { FormsModule} from '@angular/forms';
import { ItemShopListComponent } from './compoments/item-shop-list/item-shop-list.component';
export const AppRoutes: Routes = [
  { path: '**', redirectTo: '/', pathMatch: 'full' },  // ถ้าไม่เจอ part ใดเลยจะมานี้
  { path: '', component: ItemShopListComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    ItemShopListComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    RouterModule.forRoot(AppRoutes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
