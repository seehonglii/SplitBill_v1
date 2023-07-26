package nus.edu.sg.iss.app.SplitBill_V2.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping(path = "/settleup")
public class SettleupController {

//     @Autowired
//     private FriendService friendService;
//     private GroupService groupService;

    
//     @GetMapping("/user/settle-up/{userId}")
//     public ResponseEntity<UserSettleUpResponseDto> userSettleUp(@PathVariable Long userId) {
//         UserSettleUpResponseDto response = new UserSettleUpResponseDto();
//         try {
//             List<Transaction> transactions = userService.userSettleUp(userId);
//             response.setStatus(ResponseStatus.SUCCESS);
//             response.setTransactions(transactions);
//         } catch (Exception e) {
//             response.setStatus(ResponseStatus.FAILURE);
//             System.out.println(e.getMessage());
//         }
//         return ResponseEntity.ok(response);
//     }

//     @GetMapping("/user/my-total/{userId}")
//     public ResponseEntity<MyTotalResponseDto> myTotal(@PathVariable Long userId) {
//         MyTotalResponseDto response = new MyTotalResponseDto();
//         try {
//             Long amount = friendService.myTotal(userId);
//             response.setTotal(amount);
//             response.setStatus(ResponseStatus.SUCCESS);
//         } catch (Exception e) {
//             response.setStatus(ResponseStatus.FAILURE);
//             System.out.println(e.getMessage());
//         }
//         return ResponseEntity.ok(response);
//     }

//     @GetMapping("/group/settle-up/{userId}/{groupId}")
//     public ResponseEntity<GroupSettleUpResponseDto> groupSettleUp(@PathVariable Long userId, @PathVariable Long groupId) {
//         GroupSettleUpResponseDto response = new GroupSettleUpResponseDto();
//         try {
//             List<Transaction> transactions = groupService.groupSettleUp(userId, groupId);
//             response.setStatus(ResponseStatus.SUCCESS);
//             response.setTransactions(transactions);
//         } catch (Exception e) {
//             response.setStatus(ResponseStatus.FAILURE);
//             System.out.println(e.getMessage());
//         }
//         return ResponseEntity.ok(response);
//     }
// }
}
