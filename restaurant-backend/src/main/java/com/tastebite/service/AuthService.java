package com.tastebite.service;

import com.tastebite.dto.ForgotPasswordRequest;
import com.tastebite.dto.LoginRequest;
import com.tastebite.dto.LoginResponse;
import com.tastebite.dto.RegisterRequest;
import com.tastebite.dto.RegisterResponse;
import com.tastebite.dto.ResetPasswordRequest;

import com.tastebite.entity.PasswordResetToken;
import com.tastebite.entity.User;

import com.tastebite.exception.EmailAlreadyExistsException;

import com.tastebite.repository.PasswordResetTokenRepository;
import com.tastebite.repository.UserRepository;

import com.tastebite.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            PasswordResetTokenRepository passwordResetTokenRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    // =========================
    // REGISTER
    // =========================

    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(
                    "Email is already registered"
            );
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(
                        passwordEncoder.encode(request.password())
                )
                .role("CUSTOMER")
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.isEnabled(),
                "Registration successful"
        );
    }

    // =========================
    // LOGIN
    // =========================

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        if (!user.isEnabled()) {
            throw new RuntimeException(
                    "User account is disabled"
            );
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    // =========================
    // FORGOT PASSWORD
    // =========================

    @Transactional
    public String forgotPassword(
            ForgotPasswordRequest request
    ) {

        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException(
                                "No account found with this email"
                        )
                );

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByUserId(user.getId())
                        .orElse(
                                PasswordResetToken.builder()
                                        .user(user)
                                        .build()
                        );

        resetToken.setToken(token);
        resetToken.setExpiryDate(
                LocalDateTime.now().plusMinutes(15)
        );

        passwordResetTokenRepository.save(resetToken);

        return token;
    }

    // =========================
    // RESET PASSWORD
    // =========================

    @Transactional
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.token())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid reset token"
                                )
                        );

        if (resetToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            throw new RuntimeException(
                    "Reset token has expired"
            );
        }

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
}