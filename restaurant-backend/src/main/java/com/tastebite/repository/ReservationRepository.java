package com.tastebite.repository;

import com.tastebite.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserIdOrderByReservationDateDesc(
            Long userId
    );

    boolean existsByReservationDateAndReservationTime(
            LocalDate reservationDate,
            LocalTime reservationTime
    );

    List<Reservation>
    findAllByOrderByReservationDateDescReservationTimeDesc();
}