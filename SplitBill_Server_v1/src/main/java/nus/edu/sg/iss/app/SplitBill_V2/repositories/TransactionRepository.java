package nus.edu.sg.iss.app.SplitBill_V2.repositories;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Balance;
import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Transaction;
import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.TransactionRequest;

@Repository
public class TransactionRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Transaction addTransaction(TransactionRequest request) {
        String insertTransactionQuery = "INSERT INTO transactions (group_id, user_id, description, amount, tag, paidBy) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(insertTransactionQuery, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, request.getGroup_id());
            ps.setInt(2, request.getUser_id());
            ps.setString(3, request.getDescription());
            ps.setDouble(4, request.getAmount());
            ps.setString(5, request.getTag());
            ps.setString(6, request.getPaidBy());
            return ps;
        }, keyHolder);

        Integer transaction_id = keyHolder.getKey().intValue();

        // Get the current timestamp
        LocalDateTime currentDateTime = LocalDateTime.now();


        String insertDistributionQuery = "INSERT INTO transaction_distribution (transaction_id, friend_id, distributed_amount) VALUES (?, ?, ?)";
        for (Map.Entry<String, Double> entry : request.getDistribution().entrySet()) {
            String friend_id = entry.getKey();
            Double distributedAmount = entry.getValue();
            jdbcTemplate.update(insertDistributionQuery, transaction_id, friend_id, distributedAmount);
        }

        String insertShareWithQuery = "INSERT INTO transaction_sharewith (transaction_id, friend_id) VALUES (?, ?)";
        for (String friend_id : request.getShareWith()) {
            jdbcTemplate.update(insertShareWithQuery, transaction_id, friend_id);
        }

        return new Transaction(transaction_id, request.getGroup_id(), request.getUser_id(), request.getDescription(),
                request.getAmount(), request.getTag(), request.getPaidBy(), currentDateTime);
    }

    public boolean processTransaction(Long transactionId) {
        String sql = "UPDATE transactions SET processed = true WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, transactionId);
        return rowsAffected > 0;
    }

    public List<TransactionRequest> getTransactionsByGroupId(Integer group_id) {
        String sql = "SELECT * FROM transactions WHERE group_id = ?";
        List<TransactionRequest> transactions = new ArrayList<>();
        SqlRowSet rowSet = jdbcTemplate.queryForRowSet(sql, group_id);
        while (rowSet.next()) {
            TransactionRequest transaction = mapTransaction(rowSet);
            transactions.add(transaction);
        }
        return transactions;
    }

    private TransactionRequest mapTransaction(SqlRowSet rs) {
        TransactionRequest transaction = new TransactionRequest(
            rs.getInt("id"),
            rs.getInt("group_id"),
            rs.getInt("user_id"),
            rs.getString("description"),
            rs.getDouble("amount"),
            rs.getString("tag"),
            rs.getString("paidBy"),
            null,
            null,
            null
        );    
        Object createdAtObj = rs.getObject("createdAt");
        if (createdAtObj != null && createdAtObj instanceof Timestamp) {
            transaction.setCreatedAt(((Timestamp) createdAtObj).toLocalDateTime());
        }    
        transaction.setDistribution(mapDistribution(rs));
        transaction.setShareWith(mapShareWith(rs));
        return transaction;
    }    
    
    
    private List<String> mapShareWith(SqlRowSet rs) {
        List<String> shareWith = new ArrayList<>();
        Integer transactionId = rs.getInt("id"); 
        String sql = "SELECT friend_id FROM transaction_sharewith WHERE transaction_id = ?";
        SqlRowSet friendRowSet = jdbcTemplate.queryForRowSet(sql, transactionId);
        while (friendRowSet.next()) {
            String friendId = friendRowSet.getString("friend_id");
            shareWith.add(friendId);
        }
        return shareWith;
    }
        
    private Map<String, Double> mapDistribution(SqlRowSet rs) {
        Map<String, Double> distribution = new HashMap<>();
        Integer transactionId = rs.getInt("id"); 
        String sql = "SELECT friend_id, distributed_amount FROM transaction_distribution WHERE transaction_id = ?";
        SqlRowSet distributionRowSet = jdbcTemplate.queryForRowSet(sql, transactionId);
        while (distributionRowSet.next()) {
            String friendId = distributionRowSet.getString("friend_id");
            Double amount = distributionRowSet.getDouble("distributed_amount");
            distribution.put(friendId, amount);
        }
        return distribution;
    }
    

    //to be completed......

    public Optional<Transaction> findById(Long transactionId) {
        return null;
    }

    public List<Balance> getBalancesByGroupId(Integer group_id) {
        SqlRowSet rowSet = jdbcTemplate.queryForRowSet(
                "SELECT member, SUM(amount) AS netAmount " +
                        "FROM balances " +
                        "WHERE group_id = ? " +
                        "GROUP BY member",
                group_id
        );

        List<Balance> balances = new ArrayList<>();
        while (rowSet.next()) {
            String member = rowSet.getString("member");
            Double amount_owe = rowSet.getDouble("amount_owe");
            double amount_shared = rowSet.getDouble("amount_shared");           
            double netAmount = rowSet.getDouble("netAmount");
            balances.add(new Balance(group_id, group_id, member, netAmount, amount_owe, amount_shared));
        }

        return balances;
    }

    // public void createTransaction(Transaction transaction) {
    //     String sql = "INSERT INTO transactions (group_id, user_id, friend_id, amount_owe) VALUES (?, ?, ?, ?)";
    //     jdbcTemplate.update(sql, transaction.getGroupId(), transaction.getUserId(), transaction.getFriendId(), transaction.getAmountOwe());
    // }

}
