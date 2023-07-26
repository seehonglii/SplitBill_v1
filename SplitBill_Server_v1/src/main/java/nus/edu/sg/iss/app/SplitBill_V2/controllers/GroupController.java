package nus.edu.sg.iss.app.SplitBill_V2.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nus.edu.sg.iss.app.SplitBill_V2.models.groups.GroupMemberRequest;
import nus.edu.sg.iss.app.SplitBill_V2.models.groups.MyGroup;
import nus.edu.sg.iss.app.SplitBill_V2.services.GroupService;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping(path = "/groups")
public class GroupController {
    
    @Autowired
    private GroupService groupSvc; 

    @PostMapping(path = "/newgroup")
    public ResponseEntity<MyGroup> createGroup(@RequestBody String groupname) {
        MyGroup savedGroup = groupSvc.saveGroup(groupname);
        return ResponseEntity.ok(savedGroup);
    }

    @GetMapping(path = "/all-groups")
    public ResponseEntity<List<MyGroup>> getAllGroups() {
        List<MyGroup> groups = groupSvc.getAllGroups();
        return ResponseEntity.ok(groups);
    }

    @PostMapping(path = "/add-member")
    public ResponseEntity<String> addGroupMember(@RequestBody GroupMemberRequest request) {
        // Validate the request data
        if (request == null || request.getGroup_id() == null || request.getUser_id() == null || request.getFriends() == null) {
            return ResponseEntity.badRequest().body("Invalid request data");
        }
        // Extract the groupId, user_id, and friends from the request body
        int group_id = request.getGroup_id();
        int user_id = request.getUser_id();
        List<String> friends = request.getFriends();

        // Call the GroupService to add the group members
        boolean success = groupSvc.addGroupMembers(group_id, user_id, friends);

        if (success) {
            return ResponseEntity.ok("Group members added successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add group members");
        }
    }


    @GetMapping(path = "/{groupId}/get_groupname")
public ResponseEntity<Map<String, String>> getGroupnameById(@PathVariable Long groupId) {
    try {
        String groupName = groupSvc.getGroupNameById(groupId);
        Map<String, String> response = new HashMap<>();
        response.put("group_name", groupName);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    
    
    @GetMapping("/{groupId}/get_groupmembers")
    public ResponseEntity<?> getGroupMembersById(@PathVariable Long groupId) {
        try {
            return ResponseEntity.ok(groupSvc.getGroupMembersById(groupId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve group members.");
        }
    }


}
