import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/dataservice';
import { Friend } from '../friend';
import { Observer } from 'rxjs';
import { UserService } from 'src/app/UserService';

@Component({
  selector: 'app-add-friend-form',
  templateUrl: './add-friend-form.component.html',
  styleUrls: ['./add-friend-form.component.css']
})
export class AddFriendFormComponent {
  model = new Friend(0, '');
  submitted = false;
  user_id: number; // Declare the user_id variable

  constructor(
    private dataService: DataService,
    private router: Router,
    private userService: UserService
  ) {this.user_id = this.userService.getUserId()}; // Get the user_id from the UserService

  onSubmit() {
    console.log('User ID:', this.user_id);
    const observer: Observer<any> = {
      next: (data: any) => {
        window.alert('Friend added successfully.');
        this.router.navigate(['/friend-tab']);
        this.submitted = true;
      },
      error: (error: any) => {
        console.error('Error adding friend:', error);
      },
      complete: () => {
      }
    };

    this.dataService.post_add_friend(this.user_id, this.model.friend_email)
      .subscribe(observer);
  }

  returnToMainPage() {
    this.router.navigate(['/dashboard']);
  }

  newFriend() {
    this.model = new Friend(0, '');
  }
}
