package nus.edu.sg.iss.app.SplitBill_V2.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.edu.sg.iss.app.SplitBill_V2.models.friends.Friend;
import nus.edu.sg.iss.app.SplitBill_V2.repositories.FriendRepository;

@Service
public class FriendService {

    @Autowired
    private FriendRepository friendRepo;

    public Friend saveFriend(Friend friend) {
        return friendRepo.save(friend);
    }

    public List<Friend> getAllFriends() {
        return friendRepo.findAll();
    }
    
}
