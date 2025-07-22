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
import org.springframework.security.config.http.SessionCreationPolicy; // Importar esto
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource; // Asegúrate de que este import esté presente

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
                        // Regla específica para /api/eps/my-eps (antes de la regla general /api/eps/**)
                        .requestMatchers("/api/eps/my-eps").hasAnyRole("ADMIN_EPS", "USUARIO_EPS")
                        // Regla específica para /api/usuarios-eps/by-eps/{idEps}
                        .requestMatchers("/api/usuarios-eps/by-eps/**").hasAnyRole("ADMIN_CENTRAL", "ROLE_ADMIN_EPS") // Se asegura ROLE_ADMIN_EPS aquí
                        // Rutas para administradores centrales
                        .requestMatchers("/api/admin-central/**").hasRole("ADMIN_CENTRAL")
                        // Rutas para administradores de EPS
                        .requestMatchers("/api/admin-eps/**").hasAnyRole("ADMIN_CENTRAL", "ADMIN_EPS")
                        // Rutas generales para EPS (otras operaciones que solo haría Admin Central)
                        .requestMatchers("/api/eps/**").hasRole("ADMIN_CENTRAL")
                        // Rutas para usuarios por EPS (general)
                        .requestMatchers("/api/usuarios-eps/**").hasAnyRole("ADMIN_CENTRAL", "ADMIN_EPS", "USUARIO_EPS")
                        // Cualquier otra solicitud requiere autenticación
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)); // ✅ CAMBIO: Configuración explícita de la gestión de sesiones

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