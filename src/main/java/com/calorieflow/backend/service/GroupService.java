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

    public Group makeGroup(String groupName, List<String> memberEmails)
    {
        if (memberEmails.size() == 1 || memberEmails.isEmpty()) {
            throw new IllegalArgumentException("Group must contain at least 2 members.");
        }

        Group newGroup = new Group(groupName);
        Group savedGroup = groupRepository.save(newGroup);
        // the group now has a name and generated ID by the DB
        Long newGroupID = savedGroup.getId();

        // 2. Link all members to the new group
        for (String memberEmail : memberEmails) {
            User member = userRepository.findByEmail(memberEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User " + memberEmail + " not found."));

            if (member.getGroupID() != null) {
                throw new IllegalArgumentException("User " + memberEmail + " is already in a group.");
            }

            // Link user to the new group
            member.setGroupID(newGroupID);
            userRepository.save(member);
        }

        return savedGroup;
    }

    // should become obsolete
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

    public List<User> getGroupMembers(Long groupID)
    {
        return userRepository.findByGroupID(groupID);
    }

    public int getDays(Long groupID)
    {
        Group group = groupRepository.findById(groupID)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        return group.getDays();
    }

    public Group updateDays(Long groupID)
    {
        Group group = groupRepository.findById(groupID)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        group.setDays(group.getDays() + 1);
        return groupRepository.save(group);
    }

}
