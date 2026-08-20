package com.tastebite.dto;

public record RegisterResponse(
        Long id,
        String name,
        String email,
        String role,
        boolean enabled,
        String message
) {
}