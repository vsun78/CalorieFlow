package com.calorieflow.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

// entity tells the class that this class is the entity to the DB and Id defines the PK
@Entity
public class User {
    @Id
    private String email;
    private String username;
    private String passwordHash;
    private LocalDateTime dateCreated;

    private Long groupID; // Foreign key to Group

    private Boolean underBudget;

    public User(){

    }

    public User(String email, String username, String passwordHash, LocalDateTime dateCreated)
    {
        this.email = email;
        this.username = username;
        this.passwordHash = passwordHash;
        this.dateCreated = dateCreated;
        this.groupID= null; // default to null when created
        this.underBudget = null;
    }

    public String getEmail()
    {
        return email;
    }
    public String getUsername()
    {
        return username;
    }
    public String getPasswordHash()
    {
        return passwordHash;
    }
    public LocalDateTime getDateCreated()
    {
        return dateCreated;
    }

    public Long getGroupID()
    {
        return groupID;
    }

    public Boolean getUnderBudget(){
        return underBudget;
    }


    public void setEmail(String email)
    {
        this.email = email;
    }
    public void setUsername(String username)
    {
        this.username = username;
    }
    public void setPasswordHash(String passwordHash)
    {
        this.passwordHash = passwordHash;
    }
    public void setDateCreated(LocalDateTime dateCreated)
    {
        this.dateCreated = dateCreated;
    }

    public void setGroupID(Long groupID)
    {
        this.groupID = groupID;
    }

    public void setUnderBudget(Boolean underBudget)
    {
        this.underBudget = underBudget;
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                ", dateCreated=" + dateCreated +
                '}';
    }

}
