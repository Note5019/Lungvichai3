import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ItemShop } from '../../../environments/interface';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { QrCodeReader } from 'src/app/qr-code-reader.service';
@Component({
  selector: 'app-item-shop-list',
  templateUrl: './item-shop-list.component.html',
  styleUrls: ['./item-shop-list.component.css'],
  // host: {'(window:scroll)': 'doSomething($event)'}
})
export class ItemShopListComponent implements OnInit {
  @ViewChild('header') headerHtmlRef: ElementRef;
  @ViewChild('SlideNav') slideNavRef: ElementRef;
  headerOffsetTop: number;
  isFixedHeader = false;

  itemListCollectionRef: AngularFirestoreCollection<ItemShop>;
  itemList$: Observable<ItemShop[]>;
  public selectedKeyItem = '';
  public isSearch = false;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  isUploaded = false;

  searchkeyWord: string;
  addedItem: ItemShop = {
    key: '',
    name: '',
    price: 0,
    imageUrl: '',
    imageName: '',
    qty: 0
  };
  selectedItem: ItemShop = {
    name: '',
    price: 0,
    imageUrl: '',
    imageName: '',
    qty: 0
  };
  constructor(private afs: AngularFirestore, private storage: AngularFireStorage, private qrReader: QrCodeReader) {
    this.queryAllData();
    // this.itemList$ = this.itemListCollectionRef.valueChanges();
  }
  queryAllData() {
    this.itemListCollectionRef = this.afs.collection<ItemShop>('item-shop');
    this.queryData();
  }
  queryData() {
    this.itemList$ = this.itemListCollectionRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as ItemShop;
        const key = action.payload.doc.id;
        return { key, ...data };
      });
    });
  }
  ngOnInit() {
    this.headerOffsetTop = Number(this.headerHtmlRef.nativeElement.offsetTop) + 5;
    // console.log(this.headerHtmlRef.nativeElement.offsetTop);
  }
  @HostListener('window:scroll', ['$event']) onWindowScroll(event) {
    // console.log(window.pageYOffset);
    if (window.pageYOffset > this.headerOffsetTop) {
      this.isFixedHeader = true;
    } else {
      this.isFixedHeader = false;
    }
  }
  SearchItems(str: string) {
    this.isSearch = true;
    this.itemListCollectionRef = this.afs.collection<ItemShop>('item-shop', ref => ref.where('name', '>=', str));
    this.queryData();
    console.log(str);
    return false;
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
  SelectItem(item: ItemShop) {
    console.log(item);
    this.selectedKeyItem = item.key;
    this.selectedItem = item;
    console.log(this.selectedKeyItem);
    console.log(this.selectedItem);
  }
  EditItem(item: ItemShop) {
    console.log(item.key);
    this.itemListCollectionRef.doc(this.selectedKeyItem).update(item).then((res) => {
      console.log(res);

    }).catch((err) => {
      console.log(err);
    });
  }
  DeleteItem(item: ItemShop) {
    console.log('item', item);
    this.itemListCollectionRef.doc(item.key).delete().then((res) => {
      console.log(res);

    }).catch((err) => {
      console.log('err', err);
    });
  }
  onAlertFilterClosed() {
    this.queryAllData();
    this.isSearch = false;
    this.searchkeyWord = '';
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

    // fileRef.getDownloadURL().subscribe( ref => {
    //   console.log('ref', ref);
    // });

    // this.task.snapshotChanges().pipe(
    //   finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL())
    // ).subscribe( res => {
    //   console.log('resr', res);
    //   console.log('this.downloadURL', this.storage.ref(path).getDownloadURL());
    // });

    // const ref = this.storage.ref(path);
    // const downloadURL = ref.getDownloadURL().subscribe( url => {
    //   const Url = url;
    //   this.addedItem.imageUrl = Url;
    //   console.log('url : ', Url);
    // });

    // this.snapshot = this.task.snapshotChanges().pipe(
    //   tap( snap => {
    //     console.log('snaps', snap);
    //     if (snap.bytesTransferred === snap.totalBytes) {
    //       console.log('OK');
    //       this.addedItem.imageName = path;
    //       this.addedItem.imageUrl = .toString();
    //       this.isUploaded = true;
    //       // this.downloadURL.subscribe( (url) => {
    //       // });
    //       console.log('imageUrl :', this.addedItem.imageUrl);
    //     }
    //   })
    // );

    console.log('this.downloadURL', this.downloadURL);
  }

  openSlideNavs() {
    console.log(this.slideNavRef.nativeElement.className);
    if (this.slideNavRef.nativeElement.className === 'slide-nav') {
      this.slideNavRef.nativeElement.className += ' responsive';
    } else {
      this.slideNavRef.nativeElement.className = 'slide-nav';
    }
  }
}
