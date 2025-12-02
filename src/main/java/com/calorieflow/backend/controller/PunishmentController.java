package com.calorieflow.backend.controller;
import com.calorieflow.backend.User;
import com.calorieflow.backend.Punishment;
import com.calorieflow.backend.service.UserService;
import com.calorieflow.backend.service.PunishmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/punishments")
@CrossOrigin(origins = "*")
public class PunishmentController {
    private final PunishmentService punishmentService;

    public PunishmentController(PunishmentService punishmentService)
    {
        this.punishmentService = punishmentService;
    }

    @PostMapping("/assign")
    public Punishment assignPunishment(@RequestParam String assignerEmail, @RequestParam String targetEmail, @RequestParam String details)
    {
        return punishmentService.assignPunishment(assignerEmail,targetEmail,details);
    }

    @GetMapping("/retreive")
    public Punishment retreivePunishment(@RequestParam String targetEmail)
    {
        return punishmentService.retreivePunishment(targetEmail);
    }
}
