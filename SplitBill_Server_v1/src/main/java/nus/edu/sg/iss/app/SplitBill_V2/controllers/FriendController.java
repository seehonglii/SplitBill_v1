package nus.edu.sg.iss.app.SplitBill_V2.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nus.edu.sg.iss.app.SplitBill_V2.models.friends.Friend;
import nus.edu.sg.iss.app.SplitBill_V2.services.FriendService;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping(path = "/friends")
public class FriendController {
    
    @Autowired
    private FriendService friendSvc;

    @PostMapping(path = "/add-friend")
    public ResponseEntity<Friend> createFriend(@RequestBody Friend friend) {
        Friend savedFriend = friendSvc.saveFriend(friend);
        return ResponseEntity.ok(savedFriend);
    }

    @GetMapping(path = "/all-friends")
    public ResponseEntity<List<Friend>> getAllFriends() {
        List<Friend> friends = friendSvc.getAllFriends();
        return ResponseEntity.ok(friends);
    }
}
