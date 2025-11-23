package com.calorieflow.backend.service;

import com.calorieflow.backend.User;
import com.calorieflow.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// @Service is for Spring to discover this service layer class
@Service
public class UserService {

    // setup
    // "inject" the repository (database access layer) into the service layer
    // final because we never change it afterward. The repository should never be replaced halfway through
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    // constructor

    // Spring Boot automatically creates a UserRepository Object cause it sees the UserRepository interface.
    // Then it asks who needs the implementation, and this is the way of saying that this class needs the implementation

    //Spring injects it here, called "constructor injection", you don't need to write UserRepository repo = new UserRepository();
    // Spring manages it for you like magic
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // business logic below
    // service is the rules of how your system should behave using the methods from the repository as lego pieces to build its own methods

    // Register User method

    // - first make the method including the entity attributes needed
    public User registerUser(String email, String username, String plainPassword)
    {
        if(userRepository.existsByEmail(email))
        {
            throw new IllegalArgumentException("Email is already in use");
        }

        if(userRepository.existsByUsername(username))
        {
            throw new IllegalArgumentException("Username is already in use");
        }

        // hash password

        String passwordHash = passwordEncoder.encode(plainPassword);

        // create the user

        User user = new User(email,username,passwordHash, LocalDateTime.now());

        // save and return the object

        return userRepository.save(user);
    }

    // Login method

    public User loginUser(String email, String plainPassword)
    {
        // look up user by email (optional to play it safe for null)
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // check email
        if(optionalUser.isEmpty())
        {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // check password

        // Get the actual User object
        User user = optionalUser.get(); //.get gets the user object, built in method from the Optional java class (returns the value inside the Optional)

        if(!passwordEncoder.matches(plainPassword, user.getPasswordHash()))
        {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // login success, return the user


        // info validated, can pass the info back for the frontend to use
        return user;
    }

    // Delete User method

    // don't really need username/password since the user is already logged in
    public void deleteUser(String email)
    {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isEmpty())
        {
            throw new IllegalArgumentException("User with this email does not exist!");
        }

        User user = optionalUser.get();

        userRepository.deleteById(user.getEmail()); // deletes by PK
    }

    // Update User account method

    public void updateUser(String email, String username, String passwordPlain)
    {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isEmpty())
        {
            throw new IllegalArgumentException("This email is not registered");
        }

        /*
        if(userRepository.existsByUsername(username)){
            // username already taken, should be unique

            throw new IllegalArgumentException("Pick a unique username");
        }
        this method is not bad but it doesnt account for when the user doesnt want to change their username yet make updates
         */
        User user = optionalUser.get();

        if(!user.getUsername().equals(username) && userRepository.existsByUsername(username))
        {
            throw new IllegalArgumentException("Pick a unique username");
        }

        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(passwordPlain));

        userRepository.save(user); // important, need this command to write back to the DB
        // its cause we didnt do anything that writes to the DB automatically such as userRepository.deleteById(id);
    }









}
