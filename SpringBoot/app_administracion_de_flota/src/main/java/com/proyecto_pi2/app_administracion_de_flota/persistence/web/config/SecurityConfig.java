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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;
@Configuration
@EnableMethodSecurity(securedEnabled = true) // Habilita @Secured para seguridad a nivel de método
public class SecurityConfig {

    // Inyecta el bean de CorsConfigurationSource
    private final CorsConfigurationSource corsConfigurationSource;

    @Autowired
    public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilita CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Usa el bean inyectado
                .authorizeHttpRequests(authorize -> authorize
                        // Permitir acceso público al endpoint de login
                        .requestMatchers("/api/auth/login").permitAll()
                        // Rutas para administradores centrales
                        .requestMatchers("/api/admin-central/**").hasRole("ADMIN_CENTRAL")
                        // Rutas para administradores de EPS
                        .requestMatchers("/api/admin-eps/**").hasAnyRole("ADMIN_CENTRAL", "ADMIN_EPS")
                        // Rutas para EPS (puede ser gestionado por admin central)
                        .requestMatchers("/api/eps/**").hasRole("ADMIN_CENTRAL")
                        // Rutas para usuarios por EPS (puede ser gestionado por admin de EPS o admin central)
                        .requestMatchers("/api/usuarios-eps/**").hasAnyRole("ADMIN_CENTRAL", "ADMIN_EPS", "USUARIO_EPS")
                        // Cualquier otra solicitud requiere autenticación
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {}); // Habilita autenticación HTTP Basic

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