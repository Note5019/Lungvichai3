import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { ItemShop } from '../../../environments/interface';

@Component({
  selector: 'app-item-shop-list',
  templateUrl: './item-shop-list.component.html',
  styleUrls: ['./item-shop-list.component.css']
})
export class ItemShopListComponent implements OnInit {
  itemListCollectionRef: AngularFirestoreCollection<ItemShop>;
  itemList$: Observable<ItemShop[]>;

  item: ItemShop = {
    name: '',
    price: 0
  };
  constructor(private afs: AngularFirestore) {
    this.itemListCollectionRef = this.afs.collection<ItemShop>('item-shop');
    // this.itemList$ = this.itemListCollectionRef.valueChanges();
    this.itemList$ = this.itemListCollectionRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as ItemShop;
        const key = action.payload.doc.id;
        return { key, ...data };
      });
    });
  }

  ngOnInit() {
  }
  AddItem() {
    console.log(this.item.name);
    this.itemListCollectionRef.add(this.item);
    return false;
  }
  SelectItem(item: ItemShop) {
    this.item = item;
  }
  EditItem(item: ItemShop) {
    console.log(item.key);
    this.itemListCollectionRef.doc(item.key).update(item);
  }
  DeleteItem(item: ItemShop) {
    console.log(item.key);
    this.itemListCollectionRef.doc(item.key).delete();
  }
}
