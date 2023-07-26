package nus.edu.sg.iss.app.SplitBill_V2.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.edu.sg.iss.app.SplitBill_V2.repositories.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepo;

    public String saveUser(String email) {
        try {
            userRepo.saveUser(email);
            return "User saved successfully";
        } catch (Exception e) {
            return "Error saving user: " + e.getMessage();
        }
    }

    public int getUserId(String email) {
        return userRepo.getUserId(email);
    }

}
