import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemShopListComponent } from './item-shop-list.component';

describe('ItemShopListComponent', () => {
  let component: ItemShopListComponent;
  let fixture: ComponentFixture<ItemShopListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemShopListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemShopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
