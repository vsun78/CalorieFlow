package com.calorieflow.backend.repository;
import com.calorieflow.backend.Group;
import com.calorieflow.backend.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface GroupRepository extends JpaRepository<Group,Long>{

    //Optional<Group> findByGroupID(Long id);
    // the above is already a built-in JpaRepostory method

    // only need this custom query method
    // retrives all user records linked to a group id
    // findBy[] is the naming convention for the Spring data jpa
    //List<User> findByGroupID(Long groupID);




}
