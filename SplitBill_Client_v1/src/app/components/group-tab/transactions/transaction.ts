export class Transaction {
  constructor(
    public id: number,
    public group_id: number,
    public user_id: number,
    public description: string,
    public amount: number,
    public tag: string,
    public paidBy: string,
    public shareWith: string[],
    public distribution: { [friendId: string]: number } = {},
    public createdAt: Date
  ) {}
}
