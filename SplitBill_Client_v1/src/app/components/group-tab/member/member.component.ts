import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { GroupService } from 'src/app/GroupService';
import { UserService } from 'src/app/UserService';
import { DataService } from 'src/app/dataservice';
import { Friend } from '../../friend-tab/friend';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  form!: FormGroup;
  selectedGroupMembers: string[] = [];
  submitted = false;
  group_id: number = 0;

  allFriends!: Observable<string[]>;
  groupMembers!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private groupService: GroupService,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      groupmember: []
    });
  }

  ngOnInit(): void {
    // Fetch friend list from data service
    this.allFriends = this.dataService.get_all_friends().pipe(
      map((friends: Friend[]) => friends.map(friend => friend.friend_email)),
      catchError(() => of([])) // Fallback to an empty array if an error occurs or if the observable is not returned
    );


    // Assuming you have the groupId stored in the groupService
    const group_id = this.groupService.getLastClickedGroup();

    // Fetch group members using the group_id from the data service
    this.groupMembers = this.dataService.get_groupMembersById(group_id).pipe(
      map((groupMembers: any) => groupMembers.map((member: any) => member.member_email)),
      catchError(() => of([])) // Fallback to an empty array if an error occurs or if the observable is not returned
    );

  }

  submitForm(): void {
    // Extract the selected group members
    this.selectedGroupMembers = this.form.value.groupmember;

    // Assuming you have the groupId stored in the groupService
    const group_id = this.groupService.getLastClickedGroup();
    const user_id = this.userService.getUserId();
    console.log('user_id:', user_id);
    console.log('group_id:', group_id);

    // Call the data service to add group members
    this.dataService.post_add_group_member(group_id, user_id, this.selectedGroupMembers).subscribe(
      (response: any) => {
        console.log('Response:', response); // Log the response for debugging purposes
        if (response instanceof Object && response.hasOwnProperty('error')) {
          // Check if the response contains an "error" field
          window.alert('Error adding group members: ' + response.error);
        } else {
          // Assuming the response is successful
          window.alert('Group members added successfully');
          this.router.navigate(['/group-tab', { group_id: group_id }]);
        }
      },
      (error: any) => {
        console.error('Error adding group members:', error);
        window.alert('Error adding group members. Please try again.');
      }
    );

    // Reset the form
    this.form.reset();
    this.selectedGroupMembers = [];
  }

  isMemberAlreadyInGroup(member: string): boolean {
    // Assuming you have the group members stored in an array called selectedGroupMembers
    return this.selectedGroupMembers.includes(member);
  }

}
