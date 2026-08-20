package com.tastebite.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationResponse(

        Long id,
        Long userId,
        LocalDate reservationDate,
        LocalTime reservationTime,
        Integer guests,
        String status,
        String specialRequest

) {
}