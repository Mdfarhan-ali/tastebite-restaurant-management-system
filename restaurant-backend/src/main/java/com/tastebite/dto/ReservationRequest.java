package com.tastebite.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservationRequest(

        @NotNull
        LocalDate reservationDate,

        @NotNull
        LocalTime reservationTime,

        @NotNull
        @Min(1)
        @Max(20)
        Integer guests,

        @Size(max = 500)
        String specialRequest

) {
}