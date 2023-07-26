package nus.edu.sg.iss.app.SplitBill_V2.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Balance;
import nus.edu.sg.iss.app.SplitBill_V2.repositories.BalanceRepository;

@Service
public class BalanceService {

    @Autowired
    private BalanceRepository balanceRepository;

    public List<Balance> getFriendBalancesInGroups(String member) {
        List<Balance> friendBalances = balanceRepository.getBalancesByFriend(member);
        return friendBalances;
    }

    public void calculateAndInsertBalances() {
        balanceRepository.calculateAndInsertBalances();
    }

    public List<Balance> getGroupBalanceSummary(int groupId) {
        return balanceRepository.getGroupBalanceSummary(groupId);
    }

    public Balance settleUpBalance(Balance balance) {
        return balanceRepository.save(balance);
    }

}
