import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemShopListComponent } from './components/item-shop-list/item-shop-list.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { ItemFactoryListComponent } from './components/item-factory-list/item-factory-list.component';
export const AppRoutes: Routes = [
  // { path: '**', redirectTo: '/', pathMatch: 'full' },  // ถ้าไม่เจอ part ใดเลยจะมานี้
  { path: '', component: ItemShopListComponent },
  { path: 'factory-list', component: ItemFactoryListComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    ItemShopListComponent,
    HeaderComponent,
    ItemFactoryListComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    AlertModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
