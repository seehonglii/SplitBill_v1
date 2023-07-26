package nus.edu.sg.iss.app.SplitBill_V2.repositories;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;

import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Balance;
import nus.edu.sg.iss.app.SplitBill_V2.services.BalanceRowMapper;

@Repository
public class BalanceRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Balance> getBalancesByFriend(String friendEmail) {
        String sql = "SELECT * FROM balances WHERE member = ?";
        return jdbcTemplate.query(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, friendEmail);
            }
        }, new BalanceRowMapper());
    }

    public Balance findByGroupIdAndMemberId(Long groupId, Long memberId) {
        return null;
    }

    // Transfer data and calculate balance
    public void calculateAndInsertBalances() {
        // Delete existing rows in the balances table
        String deleteSql = "DELETE FROM balances";

        // Insert new balances
        String insertSql = "INSERT INTO balances (group_id, member, amount_owe, amount_shared, balance) " +
                        "SELECT " +
                        "    t.group_id, " +
                        "    t.paidBy AS member, " +
                        "    0 AS amount_owe, " +
                        "    t.amount AS amount_shared, " +
                        "    t.amount AS balance " +
                        "FROM " +
                        "    transactions t " +
                        "UNION ALL " +
                        "SELECT " +
                        "    t.group_id, " +
                        "    f.friend_email AS member, " +
                        "    td.distributed_amount AS amount_owe, " +
                        "    0 AS amount_shared, " +
                        "    -1 * td.distributed_amount AS balance " +
                        "FROM " +
                        "    transactions t " +
                        "JOIN " +
                        "    transaction_distribution td ON td.transaction_id = t.id " +
                        "JOIN " +
                        "    friends f ON td.friend_id = f.id ";

        try {
            // Execute the delete statement
            jdbcTemplate.update(deleteSql);

            // Execute the insert statement
            jdbcTemplate.update(insertSql);
            System.out.println("Balances calculation and insertion completed successfully.");
        } catch (Exception e) {
            System.err.println("Failed to calculate and insert balances: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<Balance> getGroupBalanceSummary(int groupId) {
        String sql = "SELECT group_id, member, COALESCE(SUM(amount_owe), 0) AS amount_owe, " +
                     "COALESCE(SUM(amount_shared), 0) AS amount_shared, " +
                     "COALESCE(SUM(amount_shared), 0) - COALESCE(SUM(amount_owe), 0) AS balance " +
                     "FROM balances WHERE group_id = ? GROUP BY member";
        return jdbcTemplate.query(sql, this::mapBalanceSummary, groupId);
    }

    private Balance mapBalanceSummary(ResultSet rs, int rowNum) throws SQLException {
        Balance balanceSummary = new Balance(rowNum, rowNum, null, null, null, null);
        balanceSummary.setGroup_id(rs.getInt("group_id"));
        balanceSummary.setMember(rs.getString("member"));
        balanceSummary.setAmountOwe(rs.getDouble("amount_owe"));
        balanceSummary.setAmountShared(rs.getDouble("amount_shared"));
        balanceSummary.setBalance(rs.getDouble("balance"));
        return balanceSummary;
    }

    public Balance save(Balance balance) {
        String sql = "INSERT INTO balances (group_id, member, amount_owe, amount_shared, balance) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(
                sql,
                balance.getGroup_id(),
                balance.getMember(),
                balance.getAmountOwe(),
                balance.getAmountShared(),
                balance.getBalance()
        );
        return balance;
    }
    
}
