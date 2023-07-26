import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { DataService } from 'src/app/dataservice';
import { UserService } from 'src/app/UserService';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],

})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = '';
  hide = true;

  constructor(private dataSvc: DataService, private authService: AuthService,
    private router: Router, private userService: UserService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password).pipe(
        switchMap(() => this.dataSvc.post_save_user(email))
      );
    }

    authObs.subscribe({
      next: (resData: AuthResponseData) => {
        this.isLoading = false;

        this.fetchUserId(email).subscribe({
          next: userId => {
            console.log('User ID:', userId); // For debugging purposes
            this.userService.setUserId(userId); // Store the user's ID in the UserService
          },
          error: error => {
            console.error('Error fetching user ID:', error); // For debugging purposes
          }
        });

        this.userService.setUserEmail(email);
        this.router.navigate(['/dashboard']);
      },
      error: errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    });

    form.resetForm();
  }

  fetchUserId(email: string): Observable<number> {
    return this.dataSvc.getUserIdByEmail(email).pipe(
      tap((user_id: number) => {
        console.log('User ID:', user_id); // For debugging purposes
        this.userService.setUserId(user_id); // Store the user's ID in the UserService
      }),
      catchError((error: any) => {
        console.error('Error fetching user ID:', error); // For debugging purposes
        return throwError(error);
      })
    );
  }


}
