package nus.edu.sg.iss.app.SplitBill_V2.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Transaction;
import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.TransactionRequest;
import nus.edu.sg.iss.app.SplitBill_V2.services.TransactionService;

@RestController
// @CrossOrigin(origins = "*")
@RequestMapping(path = "/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping(path = "/add")
    public ResponseEntity<Transaction> addTransaction(@RequestBody TransactionRequest request) {
    Transaction newTransaction = transactionService.addTransaction(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(newTransaction);
    }

    @PutMapping(path = "/{transaction_id}/process")
    public ResponseEntity<String> processTransaction(@PathVariable Long transaction_id) throws NotFoundException {
        boolean success = transactionService.processTransaction(transaction_id);
        if (success) {
            return ResponseEntity.ok("Transaction processed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process transaction");
        }
    }
    
    @GetMapping(path = "/{group_id}/get")
    public List<TransactionRequest> getTransactionsByGroupId(@PathVariable String group_id) {
        Integer groupId = Integer.parseInt(group_id);
        return transactionService.getTransactionsByGroupId(groupId);
    }

    @GetMapping(path = "/{groupI_id}/outstanding_balances")
    public ResponseEntity<?> getOutstandingBalances(@PathVariable Integer group_id) {
        return ResponseEntity.ok(transactionService.getOutstandingBalances(group_id));
    }

    // @PostMapping(path = "/{groupId}/settle_up")
    // public ResponseEntity<?> settleUpBalance(@PathVariable Long groupId, @RequestBody SettleUpRequest settleUpRequest) {
    //     boolean success = transactionService.settleUpBalance(groupId, settleUpRequest.getMemberId());
    //     if (success) {
    //         return ResponseEntity.ok("Settled up successfully!");
    //     } else {
    //         return ResponseEntity.badRequest().body("Failed to settle up.");
    //     }
    // }
}
