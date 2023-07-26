package nus.edu.sg.iss.app.SplitBill_V2.models.transaction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class TransactionRequest {
    private Integer id;
    private Integer group_id;
    private Integer user_id;
    private String description;
    private Double amount;
    private String tag;
    private String paidBy;
    private List<String> shareWith;
    private Map<String, Double> distribution;
    private LocalDateTime createdAt;
    public TransactionRequest(Integer id, Integer group_id, Integer user_id, String description, Double amount,
            String tag, String paidBy, List<String> shareWith, Map<String, Double> distribution,
            LocalDateTime createdAt) {
        this.id = id;
        this.group_id = group_id;
        this.user_id = user_id;
        this.description = description;
        this.amount = amount;
        this.tag = tag;
        this.paidBy = paidBy;
        this.shareWith = shareWith;
        this.distribution = distribution;
        this.createdAt = createdAt;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getGroup_id() {
        return group_id;
    }
    public void setGroup_id(Integer group_id) {
        this.group_id = group_id;
    }
    public Integer getUser_id() {
        return user_id;
    }
    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Double getAmount() {
        return amount;
    }
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    public String getTag() {
        return tag;
    }
    public void setTag(String tag) {
        this.tag = tag;
    }
    public String getPaidBy() {
        return paidBy;
    }
    public void setPaidBy(String paidBy) {
        this.paidBy = paidBy;
    }
    public List<String> getShareWith() {
        return shareWith;
    }
    public void setShareWith(List<String> shareWith) {
        this.shareWith = shareWith;
    }
    public Map<String, Double> getDistribution() {
        return distribution;
    }
    public void setDistribution(Map<String, Double> distribution) {
        this.distribution = distribution;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    @Override
    public String toString() {
        return "TransactionRequest [id=" + id + ", group_id=" + group_id + ", user_id=" + user_id + ", description="
                + description + ", amount=" + amount + ", tag=" + tag + ", paidBy=" + paidBy + ", shareWith="
                + shareWith + ", distribution=" + distribution + ", createdAt=" + createdAt + "]";
    }    
    
    
}
