package nus.edu.sg.iss.app.SplitBill_V2.services;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import nus.edu.sg.iss.app.SplitBill_V2.models.transaction.Balance;

public class BalanceRowMapper implements RowMapper<Balance> {
    @Override
    public Balance mapRow(ResultSet rs, int rowNum) throws SQLException {
        Balance balance = new Balance(rowNum, rowNum, null, null, null, null);
        balance.setId(rs.getInt("id"));
        balance.setGroup_id(rs.getInt("group_id"));
        balance.setMember(rs.getString("member"));
        balance.setAmountOwe(rs.getDouble("amount_owe"));
        balance.setAmountShared(rs.getDouble("amount_shared"));
        balance.setBalance(rs.getDouble("balance"));
        return balance;
    }
}
