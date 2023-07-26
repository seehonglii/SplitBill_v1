package nus.edu.sg.iss.app.SplitBill_V2.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import nus.edu.sg.iss.app.SplitBill_V2.services.UserService;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping(path = "/users")
public class UserController {
    
    @Autowired 
    private UserService userSvc;

    @PostMapping(path = "/save_user")
    public ResponseEntity<String> saveUser(@RequestBody String email) {
        String saveUserResult = userSvc.saveUser(email);
        return ResponseEntity.ok(saveUserResult);
    }

    @GetMapping("/get_user_id")
    public ResponseEntity<Integer> getUserId(@RequestParam String email) {
        Integer userId = userSvc.getUserId(email);
        return ResponseEntity.ok(userId);
    }
}
