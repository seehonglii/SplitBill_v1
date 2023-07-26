export class Balance {
  totalBalance: any;
  constructor(
    public id: number,
    public member: string,
    public group_id: number,
    public amountOwe: number = 0,
    public amountShared: number = 0,
    public balance: number
  ) {}
}

export interface AggregatedBalance {
  member: string;
  groupName: string;
  totalBalance: number;
  groupId: number;
}
