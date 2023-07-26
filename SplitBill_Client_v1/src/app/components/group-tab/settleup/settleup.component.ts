import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/dataservice';
import { Balance } from '../balance';

@Component({
  selector: 'app-settleup',
  templateUrl: './settleup.component.html',
  styleUrls: ['./settleup.component.css']
})
export class SettleupComponent implements OnInit {
  group_id: number = 0;
  balanceSummary: Balance[] = [];
  group_name: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const groupIdParam = params.get('group_id');
      this.group_id = groupIdParam ? +groupIdParam : 0;

      // Load the list of members with outstanding balances
      this.loadBalanceSummary();
    });
  }

  loadBalanceSummary() {
    // Call the data service to get the list of members with outstanding balances
    this.dataService.getGroupBalanceSummary(this.group_id).subscribe(
      (data: Balance[]) => {
        this.balanceSummary = data;
        console.log(data)
        this.dataService.get_groupnameById(this.group_id).subscribe(
          (groupNameData: any) => {
            this.group_name = groupNameData.group_name;
            console.log(this.group_name);
          },
          (error: any) => {
            console.log('Error fetching group name:', error);
          }
        );
      },
      (error: any) => {
        console.log('Error fetching outstanding balances:', error);
      }
    );
  }

  settleUp(member: string) {
    // Find the member's balance in the balance summary
    const memberBalance = this.balanceSummary.find((balance) => balance.member === member);
    if (!memberBalance) {
      console.error('Member not found in the balance summary.');
      return;
    }

    // Calculate the updated balances
    const amountShared = -memberBalance.amountOwe;
    const amountOwe = memberBalance.amountShared;
    const balance = amountShared - amountOwe;

    // Prepare the data for the POST request
    const updatedBalance: Balance = {
      id: memberBalance.id,
      group_id: memberBalance.group_id,
      member: memberBalance.member,
      amountOwe: amountOwe,
      amountShared: amountShared,
      balance: balance,
      totalBalance: undefined
    };

    // Call the data service to settle up the outstanding balance with the updated balance
    this.dataService.settleUpBalance(updatedBalance).subscribe(
      () => {
        console.log('Settled up successfully!');
        // Refresh the list of members with outstanding balances after settling up
        this.loadBalanceSummary();
      },
      (error: any) => {
        console.log('Error settling up:', error);
      }
    );
  }

  // Helper method to get the member with a positive balance in the group
  getMemberWithPositiveBalance(groupId: number): string {
    const memberWithPositiveBalance = this.balanceSummary.find(
      (balance) => balance.group_id === groupId && balance.balance > 0
    );
    return memberWithPositiveBalance ? memberWithPositiveBalance.member : 'Unknown Member';
  }

  returnToGroupTab() {
    this.router.navigate(['/group', this.group_id]);
  }
}
