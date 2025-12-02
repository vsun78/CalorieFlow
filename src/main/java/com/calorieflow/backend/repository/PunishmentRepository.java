package com.calorieflow.backend.repository;
import com.calorieflow.backend.Punishment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PunishmentRepository extends JpaRepository<Punishment,Long>{

    // ensures one punishment per assigner
    Optional<Punishment> findByAssignerEmail(String assignerEmail);

    // retrieve all punishments assigned to a specific failing user
    List<Punishment> findAllByTargetEmail(String targetEmail);
}
