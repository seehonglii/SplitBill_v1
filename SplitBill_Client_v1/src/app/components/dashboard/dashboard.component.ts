import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/UserService';
import { DataService } from 'src/app/dataservice';
import { Group } from '../group-tab/group';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/GroupService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  email: string | undefined;
  groups: Group[] = [];

  constructor(
    private dataService: DataService,
    private userService: UserService,
    private router: Router,
    private groupService: GroupService // Inject the GroupService
  ) {}

  ngOnInit() {
    this.email = this.userService.getUserEmail();
    this.loadGroups();
  }

  loadGroups() {
    this.dataService.getGroups().subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      },
      (error: any) => {
        console.error('Error retrieving groups:', error);
      }
    );
  }

  addGroup() {
    this.router.navigate(['/addgroup']);
  }

  goToGroup(group_id: number) {
    // Store the last clicked group using the GroupService
    this.groupService.setLastClickedGroup(group_id);
    this.router.navigate(['/group', group_id]);
  }
}
