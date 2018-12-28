import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFactoryListComponent } from './item-factory-list.component';

describe('ItemFactoryListComponent', () => {
  let component: ItemFactoryListComponent;
  let fixture: ComponentFixture<ItemFactoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFactoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFactoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
