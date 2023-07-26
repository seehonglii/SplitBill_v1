import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { GroupService } from './GroupService';
import { UserService } from './UserService';
import { Friend } from './components/friend-tab/friend';
import { Balance } from './components/group-tab/balance';
import { Group } from './components/group-tab/group';
import { Transaction } from './components/group-tab/transactions/transaction';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(
    private http:HttpClient, private userService: UserService,
    private groupService: GroupService) { }

  _URL_balancesByfriend = '/transactions';

  get_BalancesByfriend(member: string): Observable<Balance[]> {
    const url = `${this._URL_balancesByfriend}/${member}/balances`;
    return this.http.get<Balance[]>(url);
  }

  _URL_getGroupBalances = '/transactions';

  getGroupBalanceSummary(group_id: number): Observable<Balance[]> {
    const url = `${this._URL_getGroupBalances}/${group_id}/balance`;
    return this.http.get<Balance[]>(url);
  }

  _URL_settleup = '/settleup';

  settleUpBalance(balance: Balance): Observable<any> {
    return this.http.post<Balance>(this._URL_settleup, balance);
  }

  _URL_get_UserIdByEmail = '/users/get_user_id';

  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<number>(`${this._URL_get_UserIdByEmail}?email=${email}`);
  }

  _URL_get_transactions = '/transactions/';

  get_Transactions(group_id: number): Observable<Transaction[]> {
    const url = `${this._URL_get_transactions}${group_id}/get`;
    return this.http.get<Transaction[]>(url);
  }

  _URL_process_transaction = '/transactions/{transactionId}/process';

  processTransaction(transactionId: number): Observable<any> {
    return this.http.put(`${this._URL_process_transaction}`, {});
  }

  _URL_add_transaction = '/transactions/add';

  addTransaction(transaction: Transaction): Observable<any> {
    const groupId = this.groupService.getLastClickedGroup();
    if (!groupId || groupId === 0) {
      return throwError('No group selected. Please select a group before adding a transaction.');
    }
    transaction.group_id = +groupId;
    return this.http.post(this._URL_add_transaction, transaction).pipe(
      catchError((error: any) => {
        console.error('Error adding transaction:', error);
        throw new Error('Failed to add transaction. Please try again later.');
      })
    );
  }

  _URL_get_groupMembersById = '/groups/';

  get_groupMembersById(group_id: number): Observable<any> {
    const url = this._URL_get_groupMembersById + group_id + '/get_groupmembers';
    return this.http.get<any>(url);
  }

  _URL_get_groupnameById = '/groups/';

  get_groupnameById(group_id: number): Observable<string> {
    const url = this._URL_get_groupnameById + group_id + '/get_groupname';
    return this.http.get<string>(url);
  }

  _URL_save_user = '/users/save_user';

  post_save_user(email: string): Observable<any> {
    const url = `${this._URL_save_user}`;
    return this.http.post(url, email);
  }

  private apiUrl = '/friends/add-friend';

  post_add_friend(user_id: number, friend_email: string): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post(url, { user_id, friend_email });
  }

  private _Url_getallfriends = '/friends/all-friends';

  get_all_friends(): Observable<Friend[]> {
    const url = `${this._Url_getallfriends}`;
    return this.http.get<Friend[]>(url, {});
  }

  _URL_add_group = '/groups/newgroup';

  post_add_group(groupname: string): Observable<string> {
    const url = `${this._URL_add_group}`;
    return this.http.post<string>(url, groupname);
  }

  private _Url_get_all_groups = '/groups/all-groups';

  getGroups() {
    const url = `${this._Url_get_all_groups}`;
    return this.http.get<Group[]>(url, {});
  }

  private _Url_add_group_member = '/groups/add-member';

  post_add_group_member(group_id: number, user_id: number, friends: string[]) {
    const url = `${this._Url_add_group_member}`;
    const body = { group_id: group_id,
      user_id: user_id,
      friends: friends }; // Create an object with group_id and friend details
    return this.http.post<string>(url, body);
  }

}
