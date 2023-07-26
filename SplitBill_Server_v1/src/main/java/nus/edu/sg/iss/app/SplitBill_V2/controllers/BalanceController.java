package nus.edu.sg.iss.app.SplitBill_V2.controllers;

import java.util.List;

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

import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Balance;
import nus.edu.sg.iss.app.SplitBill_V2.services.BalanceService;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping(path = "/transactions")
public class BalanceController {

    @Autowired
    private BalanceService balanceService; 

    @GetMapping("/{member}/balances")
    public ResponseEntity<List<Balance>> getFriendBalancesInGroups(@PathVariable String member) {
        List<Balance> friendBalances = balanceService.getFriendBalancesInGroups(member);
        return ResponseEntity.ok(friendBalances);
    }

    @PostMapping("/calculateBalances")
    public void calculateBalances() {
        balanceService.calculateAndInsertBalances();
    }

    @GetMapping(path = "/{group_id}/balance")
    public List<Balance> getGroupBalanceSummary(@PathVariable int group_id) {
        return balanceService.getGroupBalanceSummary(group_id);
    }

    @PostMapping(path = "/settleup")
    public ResponseEntity<Balance> settleUpBalance(@RequestBody Balance balance) {
        Balance createdBalance = balanceService.settleUpBalance(balance);
        return new ResponseEntity<>(createdBalance, HttpStatus.CREATED);
    }
}
