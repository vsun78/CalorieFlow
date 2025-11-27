package com.calorieflow.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "user_group")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // specifies that the value for the PK will be generated automatically by the DB and its method
    private Long id;
    private String name;

    public Group(){ // default constructor, required by JPA)

    }

    public Group (String name)
    {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
