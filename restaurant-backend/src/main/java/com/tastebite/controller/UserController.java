package com.tastebite.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/profile")
    public String profile(Authentication authentication) {

        return "Welcome " +
                authentication.getName() +
                ". You are authenticated.";
    }
}