package nus.edu.sg.iss.app.SplitBill_V2.models.transaction;

public class ShareWith {
    private Integer id;
    private Integer transaction_id;
    private String friend_id;
    public ShareWith(Integer id, Integer transaction_id, String friend_id) {
        this.id = id;
        this.transaction_id = transaction_id;
        this.friend_id = friend_id;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getTransaction_id() {
        return transaction_id;
    }
    public void setTransaction_id(Integer transaction_id) {
        this.transaction_id = transaction_id;
    }
    public String getFriend_id() {
        return friend_id;
    }
    public void setFriend_id(String friend_id) {
        this.friend_id = friend_id;
    }
    @Override
    public String toString() {
        return "ShareWith [id=" + id + ", transaction_id=" + transaction_id + ", friend_id=" + friend_id + "]";
    }
    
}
