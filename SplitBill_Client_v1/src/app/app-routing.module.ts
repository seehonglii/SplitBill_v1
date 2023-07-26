import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ActivityTabComponent } from './components/activity-tab/activity-tab.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddFriendFormComponent } from './components/friend-tab/add-friend/add-friend-form.component';
import { FriendTabComponent } from './components/friend-tab/friend-tab.component';
import { GroupTabComponent } from './components/group-tab/group-tab.component';
import { MemberComponent } from './components/group-tab/member/member.component';
import { SettleupComponent } from './components/group-tab/settleup/settleup.component';
import { TransactionsComponent } from './components/group-tab/transactions/transactions.component';
import { AddGroupComponent } from './components/group-tab/add-group/add-group.component';


const routes: Routes = [
  { path :'login',component:AuthComponent},
  { path :'dashboard',component:DashboardComponent},
  { path :'friend-tab', component:FriendTabComponent},
  { path :'addfriend', component:AddFriendFormComponent},
  { path :'group/:group_id', component:GroupTabComponent},
  { path :'member', component:MemberComponent },
  { path :'settleup/:group_id', component:SettleupComponent },
  { path: 'group/:group_id/transaction', component: TransactionsComponent },
  { path :'addgroup', component:AddGroupComponent },
  { path :'activity-tab', component:ActivityTabComponent},
  { path :'',redirectTo: '/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
