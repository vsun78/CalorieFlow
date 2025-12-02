package com.calorieflow.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Punishment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String assignerEmail;
    private String targetEmail;
    private String details;
    public Punishment(){

    }

    public Punishment(String assignerEmail, String targetEmail, String details)
    {
        this.assignerEmail = assignerEmail;
        this.targetEmail = targetEmail;
        this.details = details;
    }

    public Long getId() {
        return id;
    }

    public String getAssignerEmail() {
        return assignerEmail;
    }

    public void setAssignerEmail(String assignerEmail) {
        this.assignerEmail = assignerEmail;
    }

    public String getTargetEmail() {
        return targetEmail;
    }

    public void setTargetEmail(String targetEmail) {
        this.targetEmail = targetEmail;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

}
