import { Router } from '@angular/router';
import { Observable, forkJoin, mapTo, switchMap, tap } from 'rxjs';
import { DataService } from 'src/app/dataservice';
import { AggregatedBalance, Balance } from '../group-tab/balance';
import { Transaction } from '../group-tab/transactions/transaction';
import { Friend } from './friend';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-tab',
  templateUrl: './friend-tab.component.html',
  styleUrls: ['./friend-tab.component.css']
})

export class FriendTabComponent implements OnInit {

  show = true;
  detailed_f_name: string | null = null;

  displayedColumns: string[] = ['username', 'amount_owe'];

  friend$: Observable<Friend[]> | undefined; // Initialize with undefined
  friendBalances: { [email: string]: { [group_id: number]: Balance[] } } = {};
  aggregatedBalances: AggregatedBalance[] = [];
  groupNames: { [groupId: number]: string } = {};

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.friend$ = this.dataService.get_all_friends();

    this.friend$?.subscribe(
      (friends: Friend[]) => {
        // Fetch balances for each friend
        const balanceRequests: Observable<Balance[]>[] = friends.map((friend) =>
          this.dataService.get_BalancesByfriend(friend.friend_email)
        );

        // Wait for all balance requests to complete
        forkJoin(balanceRequests).subscribe((friendBalances: Balance[][]) => {
          // Group balances by friend email
          friendBalances.forEach((balances, index) => {
            this.friendBalances[friends[index].friend_email] = this.groupBalances(balances);
          });

          // Get the array of group IDs from the friendBalances
          const groupIds = this.getGroupIds(this.friendBalances);

          // Fetch group names for each group ID
          this.fetchGroupNames(groupIds).subscribe(
            (groupNames: string[]) => {
              console.log('Retrieved group names:', groupNames);

              // Add group names to the groupNames object
              for (let i = 0; i < groupIds.length; i++) {
                this.groupNames[groupIds[i]] = groupNames[i];
              }

              // Update aggregatedBalances after fetching group names
              this.updateAggregatedBalances();
            },
            (error: any) => {
              console.error('Failed to retrieve group names:', error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Failed to retrieve friends:', error);
      }
    );
  }

  fetchGroupNames(groupIds: number[]): Observable<string[]> {
    const groupNameRequests: Observable<string>[] = groupIds.map(groupId =>
      this.dataService.get_groupnameById(groupId)
    );

    return new Observable<string[]>(observer => {
      const groupNames: string[] = [];
      let count = 0;

      groupNameRequests.forEach((groupNameRequest, index) => {
        groupNameRequest.subscribe(
          (groupName: string) => {
            groupNames[index] = groupName;
            count++;

            if (count === groupIds.length) {
              observer.next(groupNames);
              observer.complete();
            }
          },
          (error: any) => {
            observer.error(error);
          }
        );
      });
    });
  }

  updateAggregatedBalances() {
    // Clear existing aggregatedBalances
    this.aggregatedBalances = [];

    // After fetching group names, update the aggregatedBalances with groupName
    for (const friendEmail of Object.keys(this.friendBalances)) {
      const groupedBalances = this.friendBalances[friendEmail];
      const totalBalanceByFriend: { [groupId: number]: number } = {};

      // Calculate total balance for each friend in each group
      for (const groupIdString of Object.keys(groupedBalances)) {
        const groupId = Number(groupIdString);
        const groupBalances = groupedBalances[groupId];
        const totalBalance = this.getTotalBalance(groupBalances);
        totalBalanceByFriend[groupId] = totalBalance;
      }

      // Update the aggregatedBalances with groupName
      for (const groupIdString of Object.keys(groupedBalances)) {
        const groupId = Number(groupIdString);
        const groupName = this.groupNames[groupId];
        const totalBalance = totalBalanceByFriend[groupId];
        if (totalBalance !== 0) {
          this.aggregatedBalances.push({
            member: this.extractNameFromEmail(friendEmail),
            groupName: groupName,
            totalBalance,
            groupId
          });
        }
      }
    }

    // Sort the results to display friends with positive balances first, then friends with negative balances
    this.aggregatedBalances.sort((a, b) => b.totalBalance - a.totalBalance);

    console.log('Updated Aggregated balances:', this.aggregatedBalances);
  }

  // Helper function to group balances by group ID
  groupBalances(balances: Balance[]): { [group_id: number]: Balance[] } {
    const groupedBalances: { [group_id: number]: Balance[] } = {};
    if (balances) {
      for (const balance of balances) {
        if (!groupedBalances[balance.group_id]) {
          groupedBalances[balance.group_id] = [];
        }
        groupedBalances[balance.group_id].push(balance);
      }
    }
    return groupedBalances;
  }

  // Helper function to aggregate balances by group_id and member
  aggregateBalances(): void {
    for (const friendEmail of Object.keys(this.friendBalances)) {
      const groupedBalances = this.friendBalances[friendEmail];
      const totalBalanceByFriend: { [groupId: number]: number } = {};

      // Calculate total balance for each friend in each group
      for (const groupIdString of Object.keys(groupedBalances)) {
        const groupId = Number(groupIdString);
        const groupBalances = groupedBalances[groupId];
        const totalBalance = this.getTotalBalance(groupBalances);
        totalBalanceByFriend[groupId] = totalBalance;
      }

      // Fetch group names using the DataService
      const groupIds = Object.keys(totalBalanceByFriend).map((groupIdString) => Number(groupIdString));
      console.log('Fetching group names for group IDs:', groupIds);

      // Use forkJoin to wait for all group name requests to complete
      forkJoin(groupIds.map(groupId => this.dataService.get_groupnameById(groupId))).subscribe(
        (groupNames: string[]) => {
          console.log('Retrieved group names:', groupNames);

          // Add group names to the groupNames object
          for (let i = 0; i < groupIds.length; i++) {
            this.groupNames[groupIds[i]] = groupNames[i];
          }

          console.log('Group names object:', groupNames);

          // Add aggregated data to the array for non-zero total balances
          for (const groupIdString of Object.keys(groupedBalances)) {
            const groupId = Number(groupIdString);
            const groupName = this.groupNames[groupId];
            const totalBalance = totalBalanceByFriend[groupId];
            if (totalBalance !== 0) {
              this.aggregatedBalances.push({
                member: this.extractNameFromEmail(friendEmail), groupName: groupName, totalBalance,
                groupId: 0
              });
            }
          }

          // Sort the results to display friends with positive balances first, then friends with negative balances
          this.aggregatedBalances.sort((a, b) => b.totalBalance - a.totalBalance);

          console.log('Aggregated balances:', this.aggregatedBalances);
        },
        (error: any) => {
          console.error('Failed to retrieve group names:', error);
        }
      );
    }
  }


  extractNameFromEmail(email: string): string {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
    }
    return email;
  }

  // Helper function to convert object to array of arrays
  getBalancesArray(balancesByGroup: { [group_id: number]: Balance[] }): Balance[] {
    const allBalances: Balance[] = [];
    Object.values(balancesByGroup).forEach((groupBalances) => {
      allBalances.push(...groupBalances);
    });
    return allBalances;
  }

  // Helper function to get the group name based on the group_id
  getGroupName(groupId: number): string {
    return this.groupNames[groupId] || `Unknown Group`;
  }

  // Helper function to get an array of group IDs from the friendBalances object
  getGroupIds(friendBalances: { [email: string]: { [group_id: number]: Balance[] } }): number[] {
    const groupIds: number[] = [];
    Object.values(friendBalances).forEach((groupBalances) => {
      Object.keys(groupBalances).forEach((groupIdString) => {
        const groupId = Number(groupIdString);
        if (!groupIds.includes(groupId)) {
          groupIds.push(groupId);
        }
      });
    });
    return groupIds;
  }


  // Helper function to calculate the total balance for a group
  getTotalBalance(balances: Balance[]): number {
    return balances.reduce((total, balance) => total + balance.amountShared - balance.amountOwe, 0);
  }

  returnToMainPage() {
    this.router.navigate(['/dashboard']);
  }
}
