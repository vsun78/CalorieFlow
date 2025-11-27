package com.calorieflow.backend.controller;
import com.calorieflow.backend.User;
import com.calorieflow.backend.Group;
import com.calorieflow.backend.service.UserService;
import com.calorieflow.backend.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService)
    {
        this.groupService = groupService;
    }

    @PostMapping("/create")
    public Group makeGroup(@RequestParam String email, @RequestParam String groupName)
    {
        return groupService.makeGroup(email,groupName);
    }

    @PostMapping("/join")
    public User joinGroup(@RequestParam String email, @RequestParam Long groupID)
    {
        return groupService.joinGroup(email,groupID);
    }

    @DeleteMapping("/delete")
    public void delete(@RequestParam String userEmail)
    {
        groupService.deleteGroup(userEmail);
    }

}
