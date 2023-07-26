package nus.edu.sg.iss.app.SplitBill_V2.models.transaction;

public class Balance {
    private Integer id;
    private Integer group_id;
    private String member;
    private Double amountOwe;
    private Double amountShared;
    private Double balance;
    public Balance(Integer id, Integer group_id, String member, Double amountOwe, Double amountShared, Double balance) {
        this.id = id;
        this.group_id = group_id;
        this.member = member;
        this.amountOwe = amountOwe;
        this.amountShared = amountShared;
        this.balance = balance;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getGroup_id() {
        return group_id;
    }
    public void setGroup_id(Integer group_id) {
        this.group_id = group_id;
    }
    public String getMember() {
        return member;
    }
    public void setMember(String member) {
        this.member = member;
    }
    public Double getAmountOwe() {
        return amountOwe;
    }
    public void setAmountOwe(Double amountOwe) {
        this.amountOwe = amountOwe;
    }
    public Double getAmountShared() {
        return amountShared;
    }
    public void setAmountShared(Double amountShared) {
        this.amountShared = amountShared;
    }
    public Double getBalance() {
        return balance;
    }
    public void setBalance(Double balance) {
        this.balance = balance;
    }
    @Override
    public String toString() {
        return "Balance [id=" + id + ", group_id=" + group_id + ", member=" + member + ", amountOwe=" + amountOwe
                + ", amountShared=" + amountShared + ", balance=" + balance + "]";
    }
    
}
