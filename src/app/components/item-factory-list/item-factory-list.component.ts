import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ItemFactory, ItemCategories } from '../../../environments/interface';
import { AngularFireUploadTask } from 'angularfire2/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-item-factory-list',
  templateUrl: './item-factory-list.component.html',
  styleUrls: ['./item-factory-list.component.css']
})
export class ItemFactoryListComponent implements OnInit {
  viewMode = 'list';
  tableHeaderSort: string;
  tableHeaders = [
    {
      title: 'Name',
      orderBy: 'name',
      isShown: true
    },
    {
      title: 'Category',
      orderBy: 'category',
      isShown: true
    },
    {
      title: 'Type',
      orderBy: 'type',
      isShown: true
    },
    {
      title: 'Size',
      orderBy: 'size',
      isShown: true
    },
    {
      title: 'QTY',
      orderBy: 'qty',
      isShown: true
    },
    {
      title: 'Price',
      orderBy: 'price',
      isShown: true
    }
  ];

  itemCategory: string;

  @ViewChild('header') headerHtmlRef: ElementRef;
  headerOffsetTop: number;
  isFixedHeader = false;

  itemDetail: ItemFactory;

  itemListCollectionRef: AngularFirestoreCollection<ItemFactory>;
  itemList$: Observable<ItemFactory[]>;

  itemCategoryListCollectionRef: AngularFirestoreCollection<ItemCategories>;
  itemCategoryList$: Observable<ItemCategories[]>;

  public selectedKeyItem = '';
  public isSearch = false;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  isUploaded = false;

  searchkeyWord: string;
  constructor(private afs: AngularFirestore, private modalService: NgbModal) {

    this.queryAllData();
    // this.itemList$ = this.itemListCollectionRef.valueChanges();
  }
  ngOnInit() {
    this.headerOffsetTop = Number(this.headerHtmlRef.nativeElement.offsetTop) + 5;
    // console.log(this.headerHtmlRef.nativeElement.offsetTop);
    // console.log(this.route.snapshot.paramMap.get('viewMode'));
    // this.viewMode = this.route.snapshot.paramMap.get('viewMode');
    // if (this.viewMode === null) {
    //   this.viewMode = 'list';
    // }
    this.getItemCategories();
    this.itemCategory = '';
    this.tableHeaderSort = this.tableHeaders[1].orderBy;
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
    // console.log(this.itemCategoryList$);
  }

  queryAllData() {
    // tslint:disable-next-line:max-line-length
    if (this.itemCategory) {
      // tslint:disable-next-line:max-line-length
      this.itemListCollectionRef = this.afs.collection<ItemFactory>('item-factory', ref => ref.where('category', '==', this.itemCategory).orderBy('name'));
    } else {
      this.itemListCollectionRef = this.afs.collection<ItemFactory>('item-factory');
    }
    this.queryData();
  }
  queryData() {
    this.itemList$ = this.itemListCollectionRef.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as ItemFactory;
        const key = action.payload.doc.id;
        return { key, ...data };
      });
    });

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
    this.itemListCollectionRef = this.afs.collection<ItemFactory>('item-factory', ref => ref.where('name', '>=', str));
    this.queryData();
    console.log(str);
    return false;
  }

  selectCategory(value) {
    console.log(value);
  }

  // SelectItem(item: ItemShop) {
  //   console.log(item);
  //   this.selectedKeyItem = item.key;
  //   this.selectedItem = item;
  //   console.log(this.selectedKeyItem);
  //   console.log(this.selectedItem);
  // }
  // EditItem(item: ItemShop) {
  //   console.log(item.key);
  //   this.itemListCollectionRef.doc(this.selectedKeyItem).update(item).then((res) => {
  //     console.log(res);

  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }
  // DeleteItem(item: ItemShop) {
  //   console.log('item', item);
  //   this.itemListCollectionRef.doc(item.key).delete().then((res) => {
  //     console.log(res);

  //   }).catch((err) => {
  //     console.log('err', err);
  //   });
  // }
  onAlertFilterClosed() {
    this.queryAllData();
    this.isSearch = false;
    this.searchkeyWord = '';
  }
  // uploadFile(event) {
  //   const file = event.item(0);
  //   if (file.type.split('/')[0] !== 'image') {
  //     console.log('unsupported file type! :(');
  //     return;
  //   }
  //   const path = `upload/${new Date().getTime()}_${file.name}`;
  //   console.log('path: ', path);
  //   const customMetadata = { app: 'Lungvichai3' };
  //   // const fileRef = this.storage.ref(path);
  //   // this.task = this.storage.upload(path, file, { customMetadata });
  //   // this.percentage = this.task.percentageChanges();
  //   const fileRef = this.storage.ref(path);
  //   const task = this.storage.upload(path, file);

  //   // observe percentage changes
  //   const uploadPercent = task.percentageChanges();
  //   uploadPercent.subscribe(ref => {
  //     console.log(ref);
  //   });
  //   // get notified when the download URL is available
  //   task.snapshotChanges().pipe(
  //     finalize(() => fileRef.getDownloadURL().subscribe(url => {
  //       this.downloadURL = url;
  //       console.log('urllllllllllll', url);
  //       this.addedItem.imageName = path;
  //       this.addedItem.imageUrl = url.toString();
  //     }))
  //   )
  //     .subscribe(ref => {
  //       console.log(ref);
  //       console.log('this.downloadURL', this.downloadURL);
  //     });

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

  //   console.log('this.downloadURL', this.downloadURL);
  // }

  // openSlideNavs() {
  //   console.log(this.slideNavRef.nativeElement.className);
  //   if (this.slideNavRef.nativeElement.className === 'slide-nav') {
  //     this.slideNavRef.nativeElement.className += ' responsive';
  //   } else {
  //     this.slideNavRef.nativeElement.className = 'slide-nav';
  //   }
  // }

  viewModeChange(mode) {
    this.queryData();
  }


  openItemdetail(key, content) {
    console.log(key);
    const item = this.afs.collection<ItemFactory>('item-factory').doc(key).valueChanges().subscribe( (res: ItemFactory) => {
      this.itemDetail = res;
      console.log(this.itemDetail);
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

}
