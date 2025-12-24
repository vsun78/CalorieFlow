package com.calorieflow.backend.controller;
import com.calorieflow.backend.User;
import com.calorieflow.backend.Group;
import com.calorieflow.backend.service.UserService;
import com.calorieflow.backend.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

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
    public Group makeGroup(@RequestParam String groupName, @RequestParam List<String> memberEmails)
    {
        return groupService.makeGroup(groupName,memberEmails);
    }

    //obsolete
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

    @GetMapping("/get")
    public List<User> get(@RequestParam Long groupID){
        return groupService.getGroupMembers(groupID); }

    @PutMapping("/updateDays")
    public Group updateDays(@RequestParam Long groupID){
        return groupService.updateDays(groupID);
    }

    @GetMapping("/getDays")
    public int getDays(@RequestParam Long groupID){
        return groupService.getDays(groupID);
    }

    @GetMapping("/getGroup")
    public String getGroup(@RequestParam Long groupID){
        return groupService.getGroupName(groupID);
    }

}


