import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/GroupService';
import { DataService } from 'src/app/dataservice';

@Component({
  selector: 'app-group-tab',
  templateUrl: './group-tab.component.html',
  styleUrls: ['./group-tab.component.css']
})
export class GroupTabComponent implements OnInit {
  group_id: number = 0;
  group: any;
  groups: any[] = [];
  members: any[] = [];
  lastClickedGroupName: string | null = null; // Update the type here

  transactions: any[] = [];
  show = true;
  showbalance = true;
  detailed_f_name: number | null = null;
  f_name: any;
  lastClickedGroup: number = 0;
  lastClickedGroupMembers: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const groupIdParam = params.get('group_id');
      this.group_id = groupIdParam ? +groupIdParam : 0; // Convert to number

      // If group_id is empty, you can perform a default action, for example:
      if (!this.group_id) {
        // Redirect to a default group page or display a message
        // For example, redirect to the first group in the list:
        if (this.groups.length > 0) {
          this.router.navigate(['/group', this.groups[0].group_id]);
        } else {
          console.log('No groups found.');
        }
      } else {
        this.loadGroupData(); // Load the group data on component initialization
        this.loadGroupMembers(); // Load the group members on component initialization
        this.lastClickedGroup = +this.groupService.getLastClickedGroup();
      }
    });
  }

  onClick(group: any) {
    console.log('group object:', group);
    if (group.id === this.detailed_f_name) {
      this.show = !this.show;
      if (!this.show) {
        this.detailed_f_name = null;
        this.show = true;
      }
    } else {
      this.detailed_f_name = group.id;
      this.f_name = null;
      this.showbalance = true;

      this.loadGroupTransactions(group.id);
    }
    this.lastClickedGroup = group.id;
    this.groupService.setLastClickedGroup(group.id);

  }

  getUsernameFromEmail(email: string): string {
    const username = email.split('@')[0];
    console.log('Username from Email:', username);
    return username;
  }

  setLastClickedGroup(groupId: number) {
    this.lastClickedGroup = groupId;
  }

  loadGroupData() {
    this.dataService.getGroups().subscribe(
      (data: any[]) => {
        this.groups = data;
        const clickedGroup = this.groups.find(group => group.id === this.group_id);
        this.group = clickedGroup ? clickedGroup : null;
        this.lastClickedGroupName = clickedGroup ? clickedGroup.groupname : 'Group Not Found'; // Provide a default value if the group is not found
      },
      (error: any) => {
        console.log('Error fetching group data:', error);
      }
    );
  }

  loadGroupMembers() {
    this.dataService.get_groupMembersById(this.group_id).subscribe(
      (members: any[]) => {
        this.lastClickedGroupMembers = members;
        console.log('Group Members:', this.lastClickedGroupMembers);
      },
      (error: any) => {
        console.log('Error fetching group members:', error);
      }
    );
  }

  loadGroupTransactions(groupId: number) {
    this.dataService.get_Transactions(groupId).subscribe(
      (data: any[]) => {
        this.transactions = data.map((transaction: any) => ({
          ...transaction,
          lender: this.getUsernameFromEmail(transaction.paidBy),
          borrower: transaction.shareWith.map((email: string) =>
            this.getUsernameFromEmail(email)
          ),
        }));
        console.log('Transactions:', this.transactions);
      },
      (error: any) => {
        console.log('Error fetching transactions:', error);
      }
    );
  }

  value(amount: string): string {
    return parseFloat(amount).toFixed(2);
  }

  settle(groupId: number) {
    this.router.navigate(['/settleup', groupId]);
  }

  returnToMainPage() {
    this.router.navigate(['/dashboard']);
  }
}
