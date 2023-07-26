import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendTabComponent } from './friend-tab.component';

describe('FriendTabComponent', () => {
  let component: FriendTabComponent;
  let fixture: ComponentFixture<FriendTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
