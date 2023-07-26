package nus.edu.sg.iss.app.SplitBill_V2.repositories;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import nus.edu.sg.iss.app.SplitBill_V2.models.groups.GroupMemberRequest;
import nus.edu.sg.iss.app.SplitBill_V2.models.groups.MyGroup;

@Repository
public class GroupRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public MyGroup saveGroup(MyGroup group) {
        String query = "INSERT INTO my_groups (groupname) VALUES (?)";
        jdbcTemplate.update(query, group.getGroupname());
        return group;
    }

    public List<MyGroup> findAll() {
        final List<MyGroup> result = new LinkedList<>();
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(
            "select * from my_groups"
        );
        while (rs.next()) {
            MyGroup group = new MyGroup(
                rs.getInt("id"),
                rs.getString("groupname")                
            );
            result.add(group);
        }
        return result;
    }

    public void saveGroupMember(int group_id, int user_id, String friends) {
        String sql = "INSERT INTO group_members (group_id, user_id, friends) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, group_id, user_id, friends);
    }

    public List<GroupMemberRequest> findGroupMembersById(Long groupId) {
        String sql = "SELECT * FROM group_members WHERE group_id = ?";
        List<GroupMemberRequest> result = new LinkedList<>();

        jdbcTemplate.query(sql, (rs) -> {
            GroupMemberRequest groupMember = new GroupMemberRequest(
                rs.getInt("group_id"),
                rs.getInt("user_id"),
                Arrays.asList(rs.getString("friends").split(","))
            );
            result.add(groupMember);
        }, groupId);

        return result;
    }

    public String findGroupNameById(Long groupId) {
        String sql = "SELECT groupname FROM my_groups WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, String.class, groupId);
    }
}
