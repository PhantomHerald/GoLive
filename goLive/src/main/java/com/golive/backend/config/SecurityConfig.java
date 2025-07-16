package com.golive.backend.config;

import com.golive.backend.security.FirebaseAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/users/**",            // Allow user registration, fetching
                                "/api/streams/**",          // Allow streams
                                "/api/videos/**",           // Allow videos
                                "/api/comments/**",         // Allow comments
                                "/api/categories/**",       // Allow category endpoints
                                "/api/channels/**",         // Allow channels
                                "/api/follow/**",           // Allow follow/unfollow
                                "/api/test/firebase",       // Optional: testing endpoint
                                "/swagger-ui/**",           // Swagger if needed
                                "/v3/api-docs/**"           // Swagger if needed
                        ).permitAll()
                        .anyRequest().authenticated() // Everything else requires auth
                )
                .addFilterBefore(new FirebaseAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
