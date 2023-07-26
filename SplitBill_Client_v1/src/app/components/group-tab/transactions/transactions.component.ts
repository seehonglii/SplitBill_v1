import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { UserService } from 'src/app/UserService';
import { DataService } from 'src/app/dataservice';
import { Transaction } from './transaction';
import { GroupService } from 'src/app/GroupService';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  group_id: number = 0;
  all_friends: any[] = [];
  user_id : number = 4
  tags = ['air ticket', 'accommodation', 'food', 'entertainment', 'others'];
  userPercentage: number = 0;
  userPortion: number = 1;
  routeSubscription: Subscription | undefined;
  totalParticipants: number = 0; // Added totalParticipants variable

  transactionForm!: FormGroup;
  members_details: any;
  submitted = false;
  transactionService: any;
  model: any = {};
  lastClickedGroup: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.user_id = +this.userService.getUserId();

    this.transactionForm = this.formBuilder.group({
      desc: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      tag: ['', Validators.required],
      paidBy: ['', Validators.required],
      distributionMethod: ['equal', Validators.required],
      distribution: this.formBuilder.array([]),
      shareWith: this.formBuilder.control([])
    });

    this.routeSubscription = this.route.params
      .pipe(
        switchMap(params => {
          this.lastClickedGroup = +this.groupService.getLastClickedGroup();
          const groupIdParam = params['group_id'];

          // If the groupIdParam exists in the route params, use it
          if (groupIdParam) {
            this.group_id = parseInt(groupIdParam);
          }
          // Otherwise, use the last clicked group from the GroupService
          else {
            this.group_id = this.lastClickedGroup;
          }

          return this.dataService.get_groupnameById(this.group_id);
        })
      )
      .subscribe(
        (data: any) => {
          this.members_details = data;
          this.dataService.get_groupMembersById(this.group_id).subscribe(
            (response: any) => {
              const groupData = response[0];
              this.all_friends = groupData.friends.map((friendEmail: string) => ({
                id: friendEmail,
                name: this.getFriendNameByEmail(friendEmail)
              }));

              this.all_friends.push({ id: this.user_id, name: 'You' });

              this.transactionForm.get('paidBy')?.setValue(this.user_id);
              this.transactionForm.get('shareWith')?.setValue([this.user_id]);
            },
            (error: any) => {
              console.error('Failed to retrieve group members:', error);
            }
          );
        },
        (error: any) => {
          console.error('Failed to retrieve group details:', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const { desc, amount, tag, paidBy, shareWith } = this.transactionForm.value;
      const distributionArray = this.transactionForm.get('distribution') as FormArray;
      const distributionMethod = this.transactionForm.get('distributionMethod')?.value;

      let totalAmount = 0;
      this.totalParticipants = this.all_friends.length + 1; // +1 for the user

      // Calculate total amount based on distribution method
      if (distributionMethod === 'equal') {
        totalAmount = amount * (this.userPortion / this.totalParticipants);
      } else if (distributionMethod === 'percentage') {
        totalAmount = amount * (1 - this.userPercentage / 100);
      } else if (distributionMethod === 'portions') {
        const totalPortions = this.getTotalPortions();
        totalAmount = amount * (this.userPortion / totalPortions);
        this.totalParticipants = totalPortions;
      }

      const amountOwed = totalAmount * (this.userPortion / this.totalParticipants);
      const amountShared = totalAmount - amountOwed;

      const distribution: { [key: string]: number } = {};
      distribution[this.user_id.toString()] = this.userPercentage;

      for (const friend of this.all_friends) {
        const friendId = friend.id;
        const control = distributionArray.controls.find((control) => control.get('friendId')?.value === friendId);

        if (distributionMethod === 'percentage') {
          const percentage = control?.get('percentage')?.value || 0;
          distribution[friendId] = percentage;
        } else if (distributionMethod === 'portions') {
          const portions = control?.get('portions')?.value || 0;
          distribution[friendId] = portions;
        }
      }

      const transaction = new Transaction(
        0,
        this.group_id,
        this.user_id,
        desc,
        amount,
        tag,
        paidBy,
        shareWith,
        distribution,
        new Date()
      );

      this.dataService.addTransaction(transaction).subscribe(
        (response: any) => {
          console.log('Transaction added successfully');
          this.processTransaction(response.transactionId);
          this.transactionForm.reset();
          this.router.navigate(['/group-tab']);
        },
        (error: any) => {
          console.error('Failed to add transaction:', error);
          console.log('Error response:', error.error);
        }
      );
    }
  }

  processTransaction(transactionId: any) {
    this.dataService.processTransaction(transactionId).subscribe(
      (response: any) => {
        console.log('Transaction processed successfully');
      },
      (error: any) => {
        console.error('Failed to process transaction:', error);
      }
    )
  }

  resetForm() {
    this.transactionForm.reset();
  }

  loadTransactions() {
    throw new Error('Method not implemented.');
  }

  // Helper method to get the friend's name by email
  getFriendNameByEmail(email: string): string {
    const parts = email.split('@');
    const name = parts[0];
    return name;
  }

  getFriendShareWithControl(friendId: number): FormControl {
    return this.transactionForm.get('shareWith') as FormControl;
  }

  calculatePercentageDistribution() {
    const distributionArray = this.transactionForm.get('distribution') as FormArray;
    const totalAmount = this.transactionForm.get('amount')?.value;
    let remainingPercentage = 100;

    distributionArray.controls.forEach((control) => {
      const percentage = control.get('percentage')?.value || 0;
      control.patchValue({ percentage }); // To handle any floating-point precision errors
      remainingPercentage -= percentage;
    });

    this.userPercentage = remainingPercentage;
  }

  getFriendPercentageControl(friendId: number): FormControl {
    const distributionArray = this.transactionForm.get('distribution') as FormArray;
    const control = distributionArray.controls.find((control) => control.get('friendId')?.value === friendId);

    return control?.get('percentage') as FormControl;
  }

  getFriendPortionControl(friendId: number): FormControl {
    const distributionArray = this.transactionForm.get('distribution') as FormArray;
    const control = distributionArray.controls.find((control) => control.get('friendId')?.value === friendId);

    return control?.get('portions') as FormControl;
  }

  getDistributedAmountForUser(): number {
    const totalAmount = this.transactionForm.get('amount')?.value;
    const distributionMethod = this.transactionForm.get('distributionMethod')?.value;

    if (distributionMethod === 'equal') {
      return totalAmount / (this.transactionForm.get('shareWith')?.value.length + 1); // +1 for the user
    } else if (distributionMethod === 'percentage') {
      const userPercentage = this.getFriendPercentageControl(this.user_id)?.value;
      return (totalAmount * userPercentage) / 100;
    } else if (distributionMethod === 'portions') {
      const totalPortions = this.getTotalPortions();
      const userPortions = this.getFriendPortionControl(this.user_id)?.value || 1;
      const totalSharedAmount = totalAmount - (totalAmount / (totalPortions + 1)); // Total amount - amount owed by the user
      return (totalSharedAmount * userPortions) / totalPortions; // Distribute among all portions except the user's portion
    } else {
      return 0;
    }
  }

  getDistributedAmountForFriend(friendId: number): number {
    const totalAmount = this.transactionForm.get('amount')?.value;
    const distributionMethod = this.transactionForm.get('distributionMethod')?.value;
    const friendControl = this.transactionForm.get('distribution')?.value.find((control: any) => control.friendId === friendId);
    const friendPortions = friendControl?.portions || 1;

    if (distributionMethod === 'equal') {
      return totalAmount / (this.transactionForm.get('shareWith')?.value.length + 1); // +1 for the user
    } else if (distributionMethod === 'percentage') {
      const friendPercentage = friendControl?.percentage || 0;
      return (totalAmount * friendPercentage) / 100;
    } else if (distributionMethod === 'portions') {
      const totalPortions = this.getTotalPortions();
      return totalAmount / totalPortions * friendPortions;
    } else {
      return 0;
    }
  }

  getFriendPercentageAmount(friendId: number): number {
    const percentage = this.getFriendPercentageControl(friendId)?.value || 0;
    const totalAmount = this.transactionForm.get('amount')?.value;
    return (totalAmount * percentage) / 100;
  }

  getFriendPortionAmount(friendId: number): number {
    const portions = this.getFriendPortionControl(friendId)?.value || 1;
    const totalPortions = this.getTotalPortions();
    const totalAmount = this.transactionForm.get('amount')?.value;
    return totalAmount / totalPortions * portions;
  }

  getTotalPortions() {
    const distributionArray = this.transactionForm.get('distribution') as FormArray;
    let totalPortions = 0;

    distributionArray.controls.forEach((control) => {
      const portions = control.get('portions')?.value || 1;
      totalPortions += portions;
    });

    return totalPortions;
  }

  onUserPortionChange() {
    const distributionArray = this.transactionForm.get('distribution') as FormArray;
    const currentUserControl = distributionArray.controls.find((control) => control.get('friendId')?.value === +this.user_id);

    if (currentUserControl) {
      currentUserControl.patchValue({ portions: this.userPortion });
      const distributedAmount = this.calculateDistributedAmount();
      // Update the distributed amount for the user after changing the portion
      currentUserControl.patchValue({ amount: distributedAmount });

      // Update the shareWith FormControl
      const shareWithControl = this.getFriendShareWithControl(this.user_id);
      if (this.userPortion === 1) {
        shareWithControl.setValue([]);
      } else {
        shareWithControl.setValue([this.user_id]);
      }
    }
  }

  calculateDistributedAmount() {
    const totalAmount = this.transactionForm.get('amount')?.value;
    const distributionMethod = this.transactionForm.get('distributionMethod')?.value;
    const distributionArray = this.transactionForm.get('distribution') as FormArray;
    const currentUserControl = distributionArray.controls.find((control) => control.get('friendId')?.value === this.user_id);

    if (distributionMethod === 'equal') {
      return totalAmount / (this.transactionForm.get('shareWith')?.value.length + 1); // +1 for the user
    } else if (distributionMethod === 'percentage') {
      const totalPercentageAmount = distributionArray.controls.reduce((total: number, control) => {
        return total + (control.get('percentage')?.value || 0);
      }, 0);
      const userPercentageAmount = (totalAmount * this.userPercentage) / 100;
      const totalSharedAmount = totalAmount - userPercentageAmount;
      return totalSharedAmount / (this.totalParticipants - 1);
    } else if (distributionMethod === 'portions') {
      const userPortions = currentUserControl?.get('portions')?.value || 1;
      const userPercentage = this.userPercentage / 100;
      const friendPortions = this.getTotalPortions() - userPortions;

      const totalPortions = userPortions + friendPortions;
      const userPortionAmount = totalAmount * (userPortions / totalPortions);
      const friendPortionAmount = totalAmount * (friendPortions / totalPortions);

      if (currentUserControl) {
        currentUserControl.patchValue({ portions: userPortions, amount: userPortionAmount });
      }

      for (const friend of this.all_friends) {
        if (friend.id !== this.user_id) {
          const control = distributionArray.controls.find((control) => control.get('friendId')?.value === friend.id);
          if (control) {
            control.patchValue({ portions: friendPortions, amount: friendPortionAmount });
          }
        }
      }

      return friendPortionAmount; // Return the friend's portion amount for the user
    } else {
      return 0;
    }
  }

  onDistributionMethodChange() {
    this.calculatePercentageDistribution();

    const distributionMethod = this.transactionForm.get('distributionMethod')?.value;
    const distributionArray = this.transactionForm.get('distribution') as FormArray;
    distributionArray.clear();

    // Get the total number of participants, including the current user
    const totalAmount = this.transactionForm.get('amount')?.value;
    const equalDistributedAmount = totalAmount / this.totalParticipants;

    for (const friend of this.all_friends) {
      const friendId = friend.id;
      const defaultPortion = friendId === this.user_id ? this.userPortion : 1;
      const amountOwed = friendId === this.user_id ? (this.userPercentage / 100) * totalAmount : 0;
      const amountShared = equalDistributedAmount - amountOwed;

      const control = this.formBuilder.group({
        friendId: [friendId],
        percentage: [{ value: 0, disabled: false }], // Initialize the percentage form control
        portions: [defaultPortion],
        amountOwed: [amountOwed],
        amountShared: [amountShared]
      });

      // Add the percentage control to the friend's form group
      control.get('percentage')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);

      distributionArray.push(control);
    }

    const shareWithArray = this.transactionForm.get('shareWith') as FormControl;
    if (distributionMethod === 'portions') {
      const currentUserControl = distributionArray.controls.find((control) => control.get('friendId')?.value === this.user_id);
      if (currentUserControl) {
        currentUserControl.patchValue({ portions: this.userPortion });
      }
    }

    // Set the shareWith form control based on the distributionMethod
    if (distributionMethod !== 'equal') {
      shareWithArray.setValue([this.user_id]);
    } else {
      shareWithArray.setValue([]);
    }
  }
}

// export class TransactionsComponent implements OnInit, OnDestroy {
//   group_id: number = 0;
//   all_friends: any[] = [];
//   user_id : number = 4;
//   tags = ['air ticket', 'accommodation', 'food', 'entertainment', 'others'];
//   userPercentage: number = 0;
//   userPortion: number = 1;
//   routeSubscription: Subscription | undefined;
//   totalParticipants: number = 0; // Added totalParticipants variable

//   transactionForm!: FormGroup;
//   members_details: any;
//   submitted = false;
//   transactionService: any;
//   model: any = {};
//   lastClickedGroup: number = 0;

//   constructor(
//     private formBuilder: FormBuilder,
//     private dataService: DataService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private userService: UserService,
//     private groupService: GroupService
//   ) {}

//   ngOnInit() {
//     this.user_id = +this.userService.getUserId();

//     this.transactionForm = this.formBuilder.group({
//       group_id: [9, Validators.required],
//       user_id: [4, Validators.required],
//       description: ['', Validators.required],
//       amount: ['', [Validators.required, Validators.min(0.01)]],
//       tag: ['', Validators.required],
//       paidBy: ['', Validators.required],
//       shareWith: this.formBuilder.control([]),
//       distribution: this.formBuilder.group({})
//     });

//     this.routeSubscription = this.route.params
//       .pipe(
//         switchMap(params => {
//           this.lastClickedGroup = +this.groupService.getLastClickedGroup();
//           const groupIdParam = params['group_id'];

//           // If the groupIdParam exists in the route params, use it
//           if (groupIdParam) {
//             this.group_id = parseInt(groupIdParam);
//           }
//           // Otherwise, use the last clicked group from the GroupService
//           else {
//             this.group_id = this.lastClickedGroup;
//           }

//           return this.dataService.get_groupnameById(this.group_id);
//         })
//       )
//       .subscribe(
//         (data: any) => {
//           this.members_details = data;
//           this.dataService.get_groupMembersById(this.group_id).subscribe(
//             (response: any) => {
//               const groupData = response[0];
//               this.all_friends = groupData.friends.map((friendEmail: string) => ({
//                 id: friendEmail,
//                 name: this.getFriendNameByEmail(friendEmail)
//               }));

//               this.all_friends.push({ id: this.user_id, name: 'You' });

//               this.transactionForm.get('paidBy')?.setValue('seehonglii@gmail.com');
//               this.transactionForm.get('shareWith')?.setValue(['patrick@gmail.com', 'jason@gmail.com']);
//             },
//             (error: any) => {
//               console.error('Failed to retrieve group members:', error);
//             }
//           );
//         },
//         (error: any) => {
//           console.error('Failed to retrieve group details:', error);
//         }
//       );
//   }

//   ngOnDestroy(): void {
//     this.routeSubscription?.unsubscribe();
//   }

//   onSubmit() {
//     if (this.transactionForm.valid) {
//       const {
//         group_id,
//         user_id,
//         description,
//         amount,
//         tag,
//         paidBy,
//         shareWith,
//         distribution
//       } = this.transactionForm.value;

//       const transaction = new Transaction(
//         0,
//         group_id,
//         user_id,
//         description,
//         amount,
//         tag,
//         paidBy,
//         shareWith,
//         distribution,
//         new Date()
//       );

//       this.dataService.addTransaction(transaction).subscribe(
//         (response: any) => {
//           console.log('Transaction added successfully');
//           this.processTransaction(response.transactionId);
//           this.transactionForm.reset();
//           this.router.navigate(['/group-tab']);
//         },
//         (error: any) => {
//           console.error('Failed to add transaction:', error);
//           console.log('Error response:', error.error);
//         }
//       );
//     }
//   }

//   processTransaction(transactionId: any) {
//     this.dataService.processTransaction(transactionId).subscribe(
//       (response: any) => {
//         console.log('Transaction processed successfully');
//       },
//       (error: any) => {
//         console.error('Failed to process transaction:', error);
//       }
//     )
//   }

//   resetForm() {
//     this.transactionForm.reset();
//   }

//   loadTransactions() {
//     throw new Error('Method not implemented.');
//   }

//   // Helper method to get the friend's name by email
//   getFriendNameByEmail(email: string): string {
//     const parts = email.split('@');
//     const name = parts[0];
//     return name;
//   }

