package com.tastebite.dto;

import java.math.BigDecimal;

public record FoodResponse(

        Long id,
        String name,
        String description,
        BigDecimal price,
        String image,
        String category,
        Boolean available,
        Boolean featured

) {
}