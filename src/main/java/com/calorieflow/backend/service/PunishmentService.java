package com.calorieflow.backend.service;

import com.calorieflow.backend.Punishment;
import com.calorieflow.backend.User;
import com.calorieflow.backend.repository.PunishmentRepository;
import com.calorieflow.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
@Service
public class PunishmentService {

    private final PunishmentRepository punishmentRepository;
    private final UserRepository userRepository;

    public PunishmentService(PunishmentRepository punishmentRepository, UserRepository userRepository) {
        this.punishmentRepository = punishmentRepository;
        this.userRepository = userRepository;
    }

    public Punishment assignPunishment(String assignerEmail, String targetEmail, String details)
    {
        if(punishmentRepository.findByAssignerEmail(assignerEmail).isPresent())
        {
            throw new IllegalStateException("You have already assigned one punishment");

        }

        Punishment punishment = new Punishment(assignerEmail, targetEmail, details);
        return punishmentRepository.save(punishment);
    }

    public Punishment retreivePunishment(String targetEmail)
    {
        List<Punishment> allPunishments = punishmentRepository.findAllByTargetEmail(targetEmail);

        Random random = new Random();

        int randomIndex = random.nextInt(allPunishments.size());

        // return one punishment
        return allPunishments.get(randomIndex);

    }


}
