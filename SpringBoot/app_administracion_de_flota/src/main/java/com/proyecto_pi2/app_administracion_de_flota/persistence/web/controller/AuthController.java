package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdministradorCentralEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.LoginDto;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.UserLoginService; // Importar el servicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserLoginService userLoginService; // Inyectar UserLoginService

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserLoginService userLoginService) {
        this.authenticationManager = authenticationManager;
        this.userLoginService = userLoginService; // Inicializar
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDto loginDto) {
        UsernamePasswordAuthenticationToken login = new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword());
        Authentication authentication = this.authenticationManager.authenticate(login);

        System.out.println(authentication.isAuthenticated());
        System.out.println(authentication.getPrincipal());
        System.out.println(authentication.getAuthorities());

        // Obtener los roles (GrantedAuthority) y convertirlos a una lista de strings
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Crear un mapa para la respuesta JSON
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login exitoso");
        response.put("username", authentication.getName()); // Usar authentication.getName() que ahora es correo/DNI

        // Obtener el nombre completo y id_eps según el tipo de usuario autenticado
        if (roles.contains("ROLE_ADMIN_CENTRAL")) {
            AdministradorCentralEntity adminCentral = userLoginService.getAdminCentralByUsername(authentication.getName());
            if (adminCentral != null) {
                response.put("fullName", adminCentral.getNombres() + " " + adminCentral.getApellidos());
            }
        } else if (roles.contains("ROLE_ADMIN_EPS")) {
            AdminEpsEntity adminEps = userLoginService.getAdminEpsByUsername(authentication.getName());
            if (adminEps != null) {
                response.put("fullName", adminEps.getNombres() + " " + adminEps.getApellidos());
                response.put("idEps", adminEps.getIdEps());
            }
        } else if (roles.contains("ROLE_USUARIO_EPS")) {
            UsuarioPorEpsEntity usuarioPorEps = userLoginService.getUsuarioPorEpsByUsername(authentication.getName());
            if (usuarioPorEps != null) {
                response.put("fullName", usuarioPorEps.getNombres() + " " + usuarioPorEps.getApellidos());
                response.put("idEps", usuarioPorEps.getIdEps());
            }
        }
        response.put("roles", roles);


        // Aquí es donde normalmente generarías un JWT y lo devolverías.
        // Por ahora, solo devolvemos un mensaje de éxito y los roles.
        return ResponseEntity.ok(response);
    }
}