package nus.edu.sg.iss.app.SplitBill_V2.models.transaction;

public class TransactionDistribution {
    private Integer id;
    private Integer transactionId;
    private String friendId;
    private Double distributedAmount;
    public TransactionDistribution(Integer id, Integer transactionId, String friendId, Double distributedAmount) {
        this.id = id;
        this.transactionId = transactionId;
        this.friendId = friendId;
        this.distributedAmount = distributedAmount;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getTransactionId() {
        return transactionId;
    }
    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }
    public String getFriendId() {
        return friendId;
    }
    public void setFriendId(String friendId) {
        this.friendId = friendId;
    }
    public Double getDistributedAmount() {
        return distributedAmount;
    }
    public void setDistributedAmount(double distributedAmount) {
        this.distributedAmount = distributedAmount;
    }
    @Override
    public String toString() {
        return "transactionDistribution [id=" + id + ", transactionId=" + transactionId + ", friendId=" + friendId
                + ", distributedAmount=" + distributedAmount + "]";
    }
    
}
