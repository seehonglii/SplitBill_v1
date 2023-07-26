import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private lastClickedGroup: number = 0;

  getLastClickedGroup(): number {
    return this.lastClickedGroup;
  }

  setLastClickedGroup(groupId: number): void {
    this.lastClickedGroup = groupId;
  }
}
