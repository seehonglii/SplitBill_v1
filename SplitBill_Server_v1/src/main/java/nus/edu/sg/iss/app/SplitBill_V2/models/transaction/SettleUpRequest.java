package nus.edu.sg.iss.app.SplitBill_V2.models.transaction;

public class SettleUpRequest {
    private String memberId;

    public SettleUpRequest() {
    }

    public SettleUpRequest(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }
}
