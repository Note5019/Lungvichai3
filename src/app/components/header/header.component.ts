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
      href: ''
    },
    {
      id: 1,
      titel: 'โรงงาน',
      href: 'factory-list'
    },
    {
      id: 2,
      titel: 'อื่นๆ',
      href: ''
    }
  ];
  constructor() {
    this.selectedMenu = 0;
   }

  ngOnInit() {
  }

  activedMenu(index) {
    console.log('index', index);
    console.log('selectedMenu', this.selectedMenu);
    this.selectedMenu = index;
  }
}
