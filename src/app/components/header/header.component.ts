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
      // CSSclass: ''
    },
    {
      id: 1,
      titel: 'โรงงาน',
      href: 'factory-list',
      // CSSclass: ''
    }
  ];
  constructor() {
    this.selectedMenu = 0;
   }

  ngOnInit() {
  }

  activedMenu(index) {
    // console.log('index', index);
    // console.log('selectedMenu', this.selectedMenu);
    this.selectedMenu = index;
  }
}
