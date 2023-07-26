import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './components/auth/auth.service';
import { Subscription } from 'rxjs';
import { DataService } from './dataservice';
import { Router } from '@angular/router';
import { GroupService } from './GroupService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  private userSub!: Subscription;
  user: any;
  lastClickedGroup: any; // Variable to store the last clicked group information

  constructor(
    private dataService: DataService,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

  onGroupClick(group: any) {
    const group_id = this.groupService.getLastClickedGroup();
    this.lastClickedGroup = group_id;
    this.router.navigate(['/group', group_id]);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
