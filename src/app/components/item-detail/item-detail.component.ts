import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ItemShop } from 'src/environments/interface';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  formMode = 'shop';
  itemListCollectionRef: AngularFirestoreCollection<ItemShop>;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  isUploaded = false;

  addedItem: ItemShop = {
    key: '',
    name: '',
    price: 0,
    imageUrl: '',
    imageName: ''
  };
  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage) {
    this.itemListCollectionRef = this.afs.collection<ItemShop>('item-shop');
  }

  ngOnInit() {
  }

  AddItem() {
    console.log(this.addedItem);
    this.addedItem.key = this.afs.createId();
    console.log(this.addedItem);
    this.itemListCollectionRef.doc(this.addedItem.key).set(this.addedItem).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
    return false;
  }

  uploadFile(event) {
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('unsupported file type! :(');
      return;
    }
    const path = `upload/${new Date().getTime()}_${file.name}`;
    console.log('path: ', path);
    const customMetadata = { app: 'Lungvichai3' };
    // const fileRef = this.storage.ref(path);
    // this.task = this.storage.upload(path, file, { customMetadata });
    // this.percentage = this.task.percentageChanges();
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, file);

    // observe percentage changes
    const uploadPercent = task.percentageChanges();
    uploadPercent.subscribe(ref => {
      console.log(ref);
    });
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.downloadURL = url;
        console.log('urllllllllllll', url);
        this.addedItem.imageName = path;
        this.addedItem.imageUrl = url.toString();
      }))
    )
      .subscribe(ref => {
        console.log(ref);
        console.log('this.downloadURL', this.downloadURL);
      });
    console.log('this.downloadURL', this.downloadURL);
  }

}
