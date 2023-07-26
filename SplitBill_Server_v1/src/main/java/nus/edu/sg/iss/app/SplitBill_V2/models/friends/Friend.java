package nus.edu.sg.iss.app.SplitBill_V2.models.friends;

public class Friend {
    private Integer user_id;
    private String friend_email;
    public Friend(Integer user_id, String friend_email) {
        this.user_id = user_id;
        this.friend_email = friend_email;
    }
    public Integer getUser_id() {
        return user_id;
    }
    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }
    public String getFriend_email() {
        return friend_email;
    }
    public void setFriend_email(String friend_email) {
        this.friend_email = friend_email;
    }
    @Override
    public String toString() {
        return "Friend [user_id=" + user_id + ", friend_email=" + friend_email + "]";
    }
    
}
