package com.calorieflow.backend.controller;

import com.calorieflow.backend.User;
import com.calorieflow.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // tell Spring this is a REST controller, automatically converts objects --> JSON for the frontend
@RequestMapping("/api/users") // base URL for all endpoints here
public class UserController {

    private final UserService userService; // allows the controller call the service layer for methods like regiserUser(), loginUser(), etc

    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    // first the register endpoint to deal with the registerUser method in the service layer

    @PostMapping("/register") // when someone sends an HTTP POST request to /api/users/register, call this method
    public User register(@RequestParam String email, @RequestParam String username, @RequestParam String password)
    {
        // @RequestParam is saying "Get this value from the URL query parameters"
        // e.g. POST http://localhost:8080/api/users/register?email=james@gmail.com&username=james&password=123
        // Spring sees ?email = ..., goes into email, etc.

        return userService.registerUser(email,username,password);
    }

    @PostMapping("/login")
    public User login(@RequestParam String email, @RequestParam String password)
    {
        return userService.loginUser(email,password);
    }

    @DeleteMapping("/delete")
    public void delete(@RequestParam String email)
    {
        userService.deleteUser(email);
    }

    @PutMapping("/update")
    public void update(@RequestParam String email, @RequestParam String username, @RequestParam String password)
    {
        userService.updateUser(email,username,password);
    }






}
