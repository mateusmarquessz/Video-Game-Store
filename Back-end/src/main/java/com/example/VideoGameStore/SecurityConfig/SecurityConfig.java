package com.example.VideoGameStore.SecurityConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/games").permitAll()
                        .requestMatchers(HttpMethod.GET, "/games/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/games").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/games/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/users/profile/").authenticated()
                        .requestMatchers(HttpMethod.POST, "/users/{userId}/bio").authenticated()
                        .requestMatchers(HttpMethod.POST, "/users/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/users/{userId}/profile-image").authenticated()
                        .requestMatchers(HttpMethod.POST,"/users/{userId}/favorites/{gameId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/users/{userId}/favorites/{gameId}").authenticated()
                        .requestMatchers(HttpMethod.GET,"/users/{userId}/favorites").authenticated()
                        .requestMatchers(HttpMethod.POST,"/users/{userId}/Cart/{gameId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/users/{userId}/Cart/{gameId}").authenticated()
                        .requestMatchers(HttpMethod.GET,"/users/{userId}/Cart").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
