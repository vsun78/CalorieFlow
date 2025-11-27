package com.calorieflow.backend.service;
import com.calorieflow.backend.User;
import com.calorieflow.backend.Group;
import com.calorieflow.backend.repository.GroupRepository;
import com.calorieflow.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupService(GroupRepository groupRepository, UserRepository userRepository){
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    // business logic

    public Group makeGroup(String userEmail, String groupName)
    {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(user.getGroupID() != null)
        {
            throw new IllegalArgumentException("User is already in a group");
        }

        Group newGroup = new Group(groupName);
        Group savedGroup = groupRepository.save(newGroup);
        // the group now has a name and generated ID by the DB

        user.setGroupID(savedGroup.getId());
        userRepository.save(user);

        return savedGroup;
    }

    public User joinGroup(String userEmail, Long groupID){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(user.getGroupID() != null)
        {
            throw new IllegalArgumentException("User is already in a group");
        }

        Group group = groupRepository.findById(groupID)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        List<User> groupMembers = userRepository.findByGroupID(groupID);

        if(groupMembers.size() >= 4)
        {
            throw new IllegalStateException("Group is full (max 4 people)");
        }

        user.setGroupID(groupID);
        return userRepository.save(user);

    }

    public void deleteGroup(String userEmail)
    {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Long groupID = user.getGroupID();
        if (groupID == null) {
            throw new IllegalStateException("User is not currently in a group to end.");
        }

        List<User> members = userRepository.findByGroupID(groupID);

        for(User member : members){
            member.setGroupID(null);
            userRepository.save(member);
        }

        groupRepository.deleteById(groupID);

    }

}
