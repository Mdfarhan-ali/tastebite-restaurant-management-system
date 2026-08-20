package com.tastebite.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record FoodRequest(

        @NotBlank(message = "Food name is required")
        String name,

        @Size(max = 1000, message = "Description cannot exceed 1000 characters")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal price,

        @NotBlank(message = "Image is required")
        String image,

        @NotBlank(message = "Category is required")
        String category,

        Boolean available,

        Boolean featured
) {
}