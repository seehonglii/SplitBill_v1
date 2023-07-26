package nus.edu.sg.iss.app.SplitBill_V2.repositories;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import nus.edu.sg.iss.app.SplitBill_V2.models.friends.Friend;

@Repository
public class FriendRepository {

    @Autowired
    private JdbcTemplate template;

    public Friend save(Friend friend) {
        template.update("INSERT INTO friends (user_id, friend_email) VALUES (?, ?)",
                friend.getUser_id(), friend.getFriend_email());
        return friend;
    }

    public List<Friend> findAll() {
        final List<Friend> result = new LinkedList<>();
        final SqlRowSet rs = template.queryForRowSet(
            "select * from friends"
        );
        while (rs.next()) {
            Friend friend = new Friend(
                rs.getInt("user_id"),
                rs.getString("friend_email")                
            );
            result.add(friend);
        }
        return result;
    }
    
}
