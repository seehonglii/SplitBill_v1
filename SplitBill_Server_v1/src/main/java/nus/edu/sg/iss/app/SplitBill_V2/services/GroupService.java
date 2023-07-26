package nus.edu.sg.iss.app.SplitBill_V2.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.edu.sg.iss.app.SplitBill_V2.models.groups.GroupMemberRequest;
import nus.edu.sg.iss.app.SplitBill_V2.models.groups.MyGroup;
import nus.edu.sg.iss.app.SplitBill_V2.repositories.GroupRepository;

@Service
public class GroupService {
    
    @Autowired
    private GroupRepository groupRepo;

    public MyGroup saveGroup(String groupname) {
        MyGroup group = new MyGroup(groupname);
        group.setGroupname(groupname);
        return groupRepo.saveGroup(group);
    }

    public List<MyGroup> getAllGroups() {
        return groupRepo.findAll();
    }

    public boolean addGroupMembers(int group_id, int user_id, List<String> friends) {
        // Perform any necessary business logic or validation here
        // Save the group members in the database using the GroupRepository
        // Return true if the group members are successfully added, false otherwise
        try {
            for (String friend : friends) {
            groupRepo.saveGroupMember(group_id, user_id, friend);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<GroupMemberRequest> getGroupMembersById(Long groupId) {
        // Implement the logic to retrieve group members by groupId using groupRepository
        return groupRepo.findGroupMembersById(groupId);
    }

    public String getGroupNameById(Long groupId) {
        // Implement the logic to retrieve group name by groupId using groupRepository
        return groupRepo.findGroupNameById(groupId);
    }

}
