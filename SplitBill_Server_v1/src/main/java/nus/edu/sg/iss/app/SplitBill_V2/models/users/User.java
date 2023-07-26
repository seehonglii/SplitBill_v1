package nus.edu.sg.iss.app.SplitBill_V2.models.users;

public class User {
    private String email;

    public User(String email) {        
        this.email = email;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    @Override
    public String toString() {
        return "User [email=" + email + "]";
    }   

}
