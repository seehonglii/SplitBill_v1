import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { UserService } from './UserService';
import { ActivityTabComponent } from './components/activity-tab/activity-tab.component';
import { AuthInterceptorService } from './components/auth/auth-interceptor.service';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddFriendFormComponent } from './components/friend-tab/add-friend/add-friend-form.component';
import { FriendTabComponent } from './components/friend-tab/friend-tab.component';
import { AddGroupComponent } from './components/group-tab/add-group/add-group.component';
import { GroupTabComponent } from './components/group-tab/group-tab.component';
import { MemberComponent } from './components/group-tab/member/member.component';
import { SettleupComponent } from './components/group-tab/settleup/settleup.component';
import { TransactionsComponent } from './components/group-tab/transactions/transactions.component';
import { DataService } from './dataservice';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    LoadingSpinnerComponent,
    ActivityTabComponent,
    FriendTabComponent,
    AddFriendFormComponent,
    GroupTabComponent,
    AddGroupComponent,
    MemberComponent,
    SettleupComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [ AuthInterceptorService, UserService, DataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
