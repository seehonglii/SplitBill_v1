package nus.edu.sg.iss.app.SplitBill_V2.models.groups;

import java.util.List;

public class GroupMemberRequest {
    private Integer group_id;
    private Integer user_id;
    private List<String> friends;
    public GroupMemberRequest(Integer group_id, Integer user_id, List<String> friends) {
        this.group_id = group_id;
        this.user_id = user_id;
        this.friends = friends;
    }
    public Integer getGroup_id() {
        return group_id;
    }
    public void setGroup_id(Integer group_id) {
        this.group_id = group_id;
    }
    public Integer getUser_id() {
        return user_id;
    }
    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }
    public List<String> getFriends() {
        return friends;
    }
    public void setFriends(List<String> friends) {
        this.friends = friends;
    }
    @Override
    public String toString() {
        return "GroupMemberRequest [group_id=" + group_id + ", user_id=" + user_id + ", friends=" + friends + "]";
    }
    
}
