package com.tastebite.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderResponse(

        Long id,
        Long userId,
        BigDecimal totalAmount,
        String status,
        String deliveryAddress,
        LocalDateTime createdAt

) {
}