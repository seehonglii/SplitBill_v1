package nus.edu.sg.iss.app.SplitBill_V2.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Balance;
import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Transaction;
import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.TransactionRequest;
import nus.edu.sg.iss.app.SplitBill_V2.repositories.TransactionRepository;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepo;

    // @Autowired
    // private BalanceRepository balanceRepo;

    public Transaction addTransaction(TransactionRequest request) {
        // Implement the logic to add the transaction using transactionRepository
        return transactionRepo.addTransaction(request);
    }

    public boolean processTransaction(Long transactionId) throws NotFoundException {
        // Implement the logic to process the transaction using transactionRepository
        Optional<Transaction> optionalTransaction = transactionRepo.findById(transactionId);
        
        if (optionalTransaction.isPresent()) {
            Transaction transaction = optionalTransaction.get();
            
            // Perform processing logic here
            // For example, update the transaction status or other relevant fields
            
            transaction.setStatus("processed");
            // Add more processing logic here if needed
            
            transactionRepo.addTransaction(null);
            
            return true; // processing successful
        } else {
            throw new NotFoundException(); // transaction not found
        }
    }

    public List<TransactionRequest> getTransactionsByGroupId(Integer group_id) {
        return transactionRepo.getTransactionsByGroupId(group_id);
    }

    public List<Balance> getOutstandingBalances(Integer group_id) {
        return transactionRepo.getBalancesByGroupId(group_id);
    }

    // @Transactional
    // public boolean settleUpBalance(Long groupId, Long memberId) {
    //     // Logic to settle up the balance for the specific member in the group
    //     // update the balance for the given groupId and memberId        
    //     // balanceRepository.settleUpBalance(groupId, memberId);
    //     // transactionRepository.createTransaction(transaction);
    //     // return true if successful, false otherwise
    
    //     Balance balance = balanceRepo.findByGroupIdAndMemberId(groupId, memberId);
    //     if (balance != null) {
    //         // Check if the user owes or is owed money
    //         double netAmount = balance.getNetAmount();
    //         if (netAmount > 0) {
    //             // If the user owes money, create a transaction for the user paying the amount
    //             Transaction transaction = new Transaction(groupId, memberId, 0L, netAmount);
    //             transactionRepo.createTransaction(transaction);
    //         } else if (netAmount < 0) {
    //             // If the user is owed money, create a transaction for the user receiving the amount
    //             Transaction transaction = new Transaction(groupId, 0L, memberId, -netAmount);
    //             transactionRepo.createTransaction(transaction);
    //         }
            
    //         // Update the balance to 0 for both the user and the friend
    //         balance.setNetAmount(0.0);
    //         balanceRepo.updateNetAmount(balance.getId(), 0.0);
            
    //         return true;
    //     }
    //     return false;
    // }
}



