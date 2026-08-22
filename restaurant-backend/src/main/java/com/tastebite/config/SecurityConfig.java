package com.tastebite.config;

import com.tastebite.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // ==================================================
    // PASSWORD ENCODER
    // ==================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ==================================================
    // SECURITY FILTER CHAIN
    // ==================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // ==================================================
                // CSRF
                // ==================================================

                .csrf(csrf ->
                        csrf.disable()
                )

                // ==================================================
                // CORS
                // ==================================================

                .cors(
                        Customizer.withDefaults()
                )

                // ==================================================
                // SESSION MANAGEMENT
                // ==================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==================================================
                // AUTHORIZATION
                // ==================================================

                .authorizeHttpRequests(auth -> {

                    // ------------------------------------------------
                    // OPTIONS / CORS PREFLIGHT
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    HttpMethod.OPTIONS,
                                    "/**"
                            )
                            .permitAll();

                    // ------------------------------------------------
                    // PUBLIC AUTH APIs
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    "/api/health",
                                    "/api/auth/register",
                                    "/api/auth/login",
                                    "/api/auth/forgot-password",
                                    "/api/auth/reset-password"
                            )
                            .permitAll();

                    // ------------------------------------------------
                    // PUBLIC FOOD GET APIs
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    HttpMethod.GET,
                                    "/api/foods",
                                    "/api/foods/**"
                            )
                            .permitAll();

                    // ------------------------------------------------
                    // PUBLIC UPLOADED FILES
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    "/uploads/**",
                                    "/images/**"
                            )
                            .permitAll();

                    // ------------------------------------------------
                    // ADMIN FOOD CREATE APIs
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    HttpMethod.POST,
                                    "/api/foods",
                                    "/api/foods/upload"
                            )
                            .hasRole("ADMIN");

                    // ------------------------------------------------
                    // ADMIN FOOD UPDATE APIs
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    HttpMethod.PUT,
                                    "/api/foods/**"
                            )
                            .hasRole("ADMIN");

                    // ------------------------------------------------
                    // ADMIN FOOD DELETE APIs
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    HttpMethod.DELETE,
                                    "/api/foods/**"
                            )
                            .hasRole("ADMIN");

                    // ------------------------------------------------
                    // ADMIN ORDER APIs
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    "/api/orders/admin/**"
                            )
                            .hasRole("ADMIN");

                    // ------------------------------------------------
                    // ADMIN RESERVATION APIs
                    // ------------------------------------------------

                    auth
                            .requestMatchers(
                                    "/api/reservations/admin/**"
                            )
                            .hasRole("ADMIN");

                    // ------------------------------------------------
                    // EVERYTHING ELSE
                    // ------------------------------------------------

                    auth
                            .anyRequest()
                            .authenticated();
                })

                // ==================================================
                // JWT FILTER
                // ==================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

 

    // ==================================================
    // CORS CONFIGURATION
    // ==================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:4200",
                        "https://tastebite-frontend-9aji.onrender.com"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(
                true
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}