import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ItemFactory, ItemCategories } from 'src/environments/interface';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  @ViewChild('itemFactory') itemFactory: NgForm;
  formMode = 'factory';

  itemTypeList = [
    // { option: 'หน้า 4 (4x4)' },
    // { option: 'หน้า 5 (5x5)' },
    // { option: 'ไม่มีฝาปิด' },
    // { option: 'มีฝาปิด' },
    // { option: 'อื่น ๆ' },
  ];

  itemListCollectionRef: AngularFirestoreCollection<ItemFactory>;
  itemCategoryListCollectionRef: AngularFirestoreCollection<ItemCategories>;
  itemCategoryList$: Observable<ItemCategories[]>;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  itemImagePath: string;
  itemImageDownloadUrl: Observable<string>;
  isUploaded = false;

  isSuccessed = false;
  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private location: Location) {
    // this.itemListCollectionRef = this.afs.collection<ItemShop>('item-shop');
    this.getItemCategories();
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
  }

  getItemCategories() {
    this.itemCategoryListCollectionRef = this.afs.collection<ItemCategories>('master-data/factory/categories');
    this.itemCategoryList$ = this.itemCategoryListCollectionRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as ItemCategories;
        const key = action.payload.doc.id;
        return { key, ...data };
      });
    });
    console.log(this.itemCategoryList$);
  }

  categoryChange() {
    const test = this.itemCategoryListCollectionRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as ItemCategories;
        const key = action.payload.doc.id;
        return { key, ...data };
      });
    });
    test.subscribe(res => {
      console.log(this.itemFactory.value.itemCategory);
      const index = res.findIndex(e => e.name === this.itemFactory.value.itemCategory);
      this.itemTypeList = res[index].type;
    });
  }

  addItemFactory() {
    console.log(this.itemFactory);
    this.itemListCollectionRef = this.afs.collection<ItemFactory>('item-factory');
    const itemKey = this.afs.createId();
    this.itemListCollectionRef.doc(itemKey).set({
      key: itemKey,
      name: this.itemFactory.value.itemName,
      type: this.itemFactory.value.itemType,
      size: this.itemFactory.value.itemSize,
      qty: this.itemFactory.value.itemQty,
      price: this.itemFactory.value.itemPrice,
      category: this.itemFactory.value.itemCategory,
      imageUrl: (this.itemImageDownloadUrl) ? this.itemImageDownloadUrl : null,
      imagePath: (this.itemImagePath) ? this.itemImagePath : null
    }).then(() => {
      console.log('create item success!');
      const itemStockingCollectionRef = this.afs.collection<any>(`/item-factory/${itemKey}/stocking`);
      // tslint:disable-next-line:max-line-length
      const stockKey = `${new Date().getUTCFullYear()}_${new Date().getMonth() + 1}_${new Date().getDay() - 1}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}_${new Date().getMilliseconds()}`;
      itemStockingCollectionRef.doc(stockKey).set({
        date: new Date(),
        type: 'in',
        qty: this.itemFactory.value.itemQty,
        remark: 'created item, initial qty.',
      }).then(() => {
        console.log('create stock success!');
        this.isSuccessed = true;
      });
    });
  }

  uploadFile(event) {
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('unsupported file type! :(');
      return;
    }
    const path = `itemImage/${new Date().getTime()}_${file.name}`;
    console.log('path: ', path);
    const customMetadata = { app: 'Lungvichai3' };
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, file, { customMetadata });

    // observe percentage changes
    this.percentage = task.percentageChanges();
    this.percentage.subscribe(ref => {
      console.log('percent: ', ref);
    });

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.itemImagePath = path;
        this.itemImageDownloadUrl = url.toString();
        this.isUploaded = true;
      }))
    ).subscribe(ref => {
      console.log(ref);
    });
  }

  removeImage() {
    console.log(this.itemFactory.controls.itemImage.value);
    this.itemFactory.controls.itemImage.reset();
    const task = this.storage.ref(this.itemImagePath).delete().subscribe((res) => {
      console.log('res', res);
      this.itemImagePath = undefined;
      this.itemImageDownloadUrl = undefined;
      this.isUploaded = false;
      this.percentage = undefined;
    });
  }

  onAlertSuccessClosed() {
    this.itemFactory.form.reset();
    this.isSuccessed = false;
  }

}
