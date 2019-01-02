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
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbButtonsModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { HeaderComponent } from './components/header/header.component';
import { ItemFactoryListComponent } from './components/item-factory-list/item-factory-list.component';

// import { NgxQRCodeModule } from 'ngx-qrcode2';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrCodeReader } from './qr-code-reader.service';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
export const AppRoutes: Routes = [
  { path: 'factory-list', component: ItemFactoryListComponent },
  { path: 'item-detail', component: ItemDetailComponent },
  { path: '', component: ItemFactoryListComponent  }, // ItemShopListComponent
  { path: '**', redirectTo: '/', pathMatch: 'full' }  // ถ้าไม่เจอ part ใดเลยจะมานี้
];
@NgModule({
  declarations: [
    AppComponent,
    ItemShopListComponent,
    HeaderComponent,
    ItemFactoryListComponent,
    ItemDetailComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    RouterModule.forRoot(AppRoutes),
    AngularFontAwesomeModule,
    FormsModule,
    NgbButtonsModule,
    NgbDropdownModule,
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    // NgxQRCodeModule, // ตัวแปลงคำเป็นคิวอาร์โค้ด
    // ZXingScannerModule.forRoot()
  ],
  providers: [QrCodeReader],
  bootstrap: [AppComponent]
})
export class AppModule { }
