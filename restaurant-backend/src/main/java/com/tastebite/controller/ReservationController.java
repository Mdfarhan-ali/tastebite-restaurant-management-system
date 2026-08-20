package com.tastebite.controller;

import com.tastebite.dto.ReservationRequest;
import com.tastebite.dto.ReservationResponse;
import com.tastebite.entity.User;
import com.tastebite.repository.UserRepository;
import com.tastebite.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    public ReservationController(
            ReservationService reservationService,
            UserRepository userRepository
    ) {
        this.reservationService = reservationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            Authentication authentication,
            @Valid @RequestBody ReservationRequest request
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        reservationService.createReservation(
                                user.getId(),
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>>
    getMyReservations(
            Authentication authentication
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return ResponseEntity.ok(
                reservationService.getMyReservations(
                        user.getId()
                )
        );
    }

    @GetMapping("/admin")
    public ResponseEntity<List<ReservationResponse>>
    getAllReservations() {

        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }

    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<ReservationResponse>
    updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        return ResponseEntity.ok(
                reservationService.updateReservationStatus(
                        id,
                        status
                )
        );
    }
}