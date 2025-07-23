package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdministradorCentralEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.security.JwtUtil;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.LoginDto;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.UserLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserLoginService userLoginService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserLoginService userLoginService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userLoginService = userLoginService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDto loginDto) {
        UsernamePasswordAuthenticationToken login = new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword());
        Authentication authentication = this.authenticationManager.authenticate(login);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String jwt = jwtUtil.generateToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login exitoso");
        response.put("jwt", jwt);
        response.put("username", userDetails.getUsername());

        if (roles.contains("ROLE_ADMIN_CENTRAL")) {
            AdministradorCentralEntity adminCentral = userLoginService.getAdminCentralByUsername(userDetails.getUsername());
            if (adminCentral != null) {
                response.put("fullName", adminCentral.getNombres() + " " + adminCentral.getApellidos());
            }
        } else if (roles.contains("ROLE_ADMIN_EPS")) {
            AdminEpsEntity adminEps = userLoginService.getAdminEpsByUsername(userDetails.getUsername());
            if (adminEps != null) {
                response.put("fullName", adminEps.getNombres() + " " + adminEps.getApellidos());
                response.put("idEps", adminEps.getIdEps());
            }
        } else if (roles.contains("ROLE_USUARIO_EPS")) {
            UsuarioPorEpsEntity usuarioPorEps = userLoginService.getUsuarioPorEpsByUsername(userDetails.getUsername());
            if (usuarioPorEps != null) {
                response.put("fullName", usuarioPorEps.getNombres() + " " + usuarioPorEps.getApellidos());
                response.put("idEps", usuarioPorEps.getIdEps());
            }
        }
        response.put("roles", roles);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        System.out.println("Usuario " + (authentication != null ? authentication.getName() : "desconocido") + " ha cerrado sesión.");

        new SecurityContextLogoutHandler().logout(request, response, authentication);
        SecurityContextHolder.clearContext();

        Map<String, String> logoutResponse = new HashMap<>();
        logoutResponse.put("message", "Sesión cerrada exitosamente.");
        return ResponseEntity.ok(logoutResponse);
    }
}