import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userEmail!: string;
  private userId!: number;

  setUserEmail(email: string): void {
    console.log('Setting user email:', email);
    this.userEmail = email;
  }

  getUserEmail(): string {
    return this.userEmail;
  }

  getUserId(): number {
    return this.userId;
  }

  setUserId(userId: number | undefined) {
    this.userId = userId !== undefined ? userId : 0; 
  }
}
