package com.proyecto_pi2.app_administracion_de_flota.persistence.web.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
@Configuration
@EnableMethodSecurity(securedEnabled = true) // Habilita @Secured para seguridad a nivel de método
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    @Autowired
    public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/eps/my-eps").hasAnyRole("ADMIN_EPS", "USUARIO_EPS")
                        // ✅ CAMBIO CRÍTICO: "ROLE_ADMIN_EPS" a "ADMIN_EPS"
                        .requestMatchers("/api/usuarios-eps/by-eps/**").hasAnyRole("ADMIN_CENTRAL", "ADMIN_EPS")
                        .requestMatchers("/api/admin-central/**").hasRole("ADMIN_CENTRAL")
                        .requestMatchers("/api/admin-eps/**").hasAnyRole("ADMIN_CENTRAL", "ADMIN_EPS")
                        .requestMatchers("/api/eps/**").hasRole("ADMIN_CENTRAL")
                        .requestMatchers("/api/usuarios-eps/**").hasAnyRole("ADMIN_CENTRAL", "ADMIN_EPS", "USUARIO_EPS")
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}