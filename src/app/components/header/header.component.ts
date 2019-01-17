import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedMenu: number;
  headerNavbarList: any[] = [
    {
      id: 0,
      titel: 'หน้าร้าน',
      href: '',
      subMenu: [
        {
          title: 'test',
          href: '#'
        }
      ]
    },
    {
      id: 1,
      titel: 'โรงงาน',
      href: 'factory-list',
      subMenu: [
        {
          title: 'เพิ่มสินค้าโรงงาน',
          href: 'item-detail'
        },
        {
          title: 'test',
          href: '#'
        },
        {
          title: 'test',
          href: '#'
        }
      ]
    }
  ];
  constructor() {
    this.selectedMenu = 0;
    // console.log(this.router.url);
   }

  ngOnInit() {
  }

  activedMenu(index) {
    // console.log('index', index);
    // console.log('selectedMenu', this.selectedMenu);
    this.selectedMenu = index;
  }

  // goTopage(viewMode) {
  //   this.router.navigate(['/factory-list', viewMode]);
  // }
}
