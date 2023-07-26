package nus.edu.sg.iss.app.SplitBill_V2.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    
    @Autowired 
    private JdbcTemplate jdbcTemplate;

    public void saveUser(String email) {
        String query = "INSERT INTO users (email) VALUES (?)";
        jdbcTemplate.update(query, email);
    }

    public String getUserEmail(int userId) {
        String query = "SELECT email FROM users WHERE id = ?";
        return jdbcTemplate.queryForObject(query, String.class, userId);
    }

    public int getUserId(String email) {
        String query = "SELECT id FROM users WHERE email = ?";
        int userId = jdbcTemplate.queryForObject(query, Integer.class, email);
        System.out.println("User ID fetched from the database: " + userId);
        return userId;
    }
}
