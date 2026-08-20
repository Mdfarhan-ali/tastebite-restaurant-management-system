package com.tastebite.service;

import com.tastebite.dto.ReservationRequest;
import com.tastebite.dto.ReservationResponse;
import com.tastebite.entity.Reservation;
import com.tastebite.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationService(
            ReservationRepository reservationRepository
    ) {
        this.reservationRepository = reservationRepository;
    }

    public ReservationResponse createReservation(
            Long userId,
            ReservationRequest request
    ) {

        boolean alreadyBooked =
                reservationRepository
                        .existsByReservationDateAndReservationTime(
                                request.reservationDate(),
                                request.reservationTime()
                        );

        if (alreadyBooked) {
            throw new RuntimeException(
                    "This time slot is already reserved"
            );
        }

        Reservation reservation = Reservation.builder()
                .userId(userId)
                .reservationDate(request.reservationDate())
                .reservationTime(request.reservationTime())
                .guests(request.guests())
                .specialRequest(request.specialRequest())
                .status("PENDING")
                .build();

        return toResponse(
                reservationRepository.save(reservation)
        );
    }

    public List<ReservationResponse> getMyReservations(
            Long userId
    ) {

        return reservationRepository
                .findByUserIdOrderByReservationDateDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ReservationResponse toResponse(
            Reservation reservation
    ) {

        return new ReservationResponse(
                reservation.getId(),
                reservation.getUserId(),
                reservation.getReservationDate(),
                reservation.getReservationTime(),
                reservation.getGuests(),
                reservation.getStatus(),
                reservation.getSpecialRequest()
        );
    }

    public List<ReservationResponse> getAllReservations() {

        return reservationRepository
                .findAllByOrderByReservationDateDescReservationTimeDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ReservationResponse updateReservationStatus(
            Long id,
            String status
    ) {

        Reservation reservation =
                reservationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Reservation not found"
                                )
                        );

        reservation.setStatus(status);

        return toResponse(
                reservationRepository.save(reservation)
        );
    }
}