package com.calorieflow.backend.repository;



import com.calorieflow.backend.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// extending JpaRepository gives a bunch of functions like save(user), findById(email), findAll(), etc

// User is the entity type
// String is the PK type
public interface UserRepository extends JpaRepository<User,String>{

    // add methods needed for login / signup

    // basically Spring takes these methods and turns them into SQL queries
    // for example, findByUsername uses the findBy keyword so Spring generates: "SELECT * FROM users WHERE username = ?"

    // look up a user by email

    // custom queries
    Optional<User> findByEmail(String email);
    // Optional is the way Java handles null values safely (if need be)


    // look up a user by username
    Optional<User> findByUsername(String username);


    // check if a user email already exists
    boolean existsByEmail(String email);


    // check if a username is taken
    boolean existsByUsername(String username);

    List<User> findByGroupID(Long groupID);
}
