package com.PgPeekIn.Backend;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfigure {

    @Bean
    public PasswordEncoder passwordEncoder() throws Exception {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtFilter jwtFilter) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC
                        // =========================

                        .requestMatchers(
                                "/error"
                        ).permitAll()
                        .requestMatchers(
                            HttpMethod.POST,
                            "/PgPeekIn/users/login",
                            "/PgPeekIn/users/register"
                        ).permitAll()


                        .requestMatchers(
                                "/PgPeekIn/users/login",
                                "/PgPeekIn/users/register"
                        ).permitAll()
                        // =========================
                        // OWNER - PG
                        // =========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/pgowner/addpg"
                        ).hasRole("owner")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/pgowner/updatepg/*"
                        ).hasRole("owner")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/pgowner/user/*"
                        ).hasRole("owner")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/pgowner/my-pg"
                        ).hasRole("owner")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/pgowner/photos/*"
                        ).hasRole("owner")


                        // =========================
                        // OWNER - BOOKINGS
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/owner/bookings"
                        ).hasRole("owner")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/owner/bookings/*"
                        ).hasRole("owner")


                        // =========================
                        // ROOM - OWNER
                        // =========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/PgPeekIn/pgs/*/rooms"
                        ).hasRole("owner")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/PgPeekIn/pgs/*/rooms/*"
                        ).hasRole("owner")


                        // =========================
                        // ROOM - PUBLIC / TENANT
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/PgPeekIn/pgs/*/rooms"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/PgPeekIn/pgs/*/rooms/available"
                        ).permitAll()


                        // =========================
                        // TENANT
                        // =========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/bookings"
                        ).hasRole("tenant")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/pgs/*/reviews"
                        ).hasRole("tenant")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/pgs/*/reviews"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/pgowner/search/*"
                        ).hasRole("tenant")
                        .requestMatchers(HttpMethod.GET, "/api/tenant/search"
                                
                        ).hasRole("tenant")


                        // =========================
                        // EVERYTHING ELSE
                        // =========================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("*")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
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