package com.proyecto_pi2.app_administracion_de_flota.persistence.service;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdministradorCentralEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.AdminEpsRepository;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.AdministradorCentralRepository;
import com.proyecto_pi2.app_administracion_de_flota.persistence.repository.UsuarioPorEpsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserLoginService implements UserDetailsService {

    private final AdministradorCentralRepository adminCentralRepository;
    private final AdminEpsRepository adminEpsRepository;
    private final UsuarioPorEpsRepository usuarioPorEpsRepository;

    @Autowired
    public UserLoginService(AdministradorCentralRepository adminCentralRepository,
                            AdminEpsRepository adminEpsRepository,
                            UsuarioPorEpsRepository usuarioPorEpsRepository) {
        this.adminCentralRepository = adminCentralRepository;
        this.adminEpsRepository = adminEpsRepository;
        this.usuarioPorEpsRepository = usuarioPorEpsRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("--- Intentando autenticar usuario: " + username + " ---");

        // 1. Intentar cargar como Administrador Central (prioridad por correo, luego por DNI)
        AdministradorCentralEntity adminCentral = adminCentralRepository.findByCorreo(username);
        if (adminCentral == null) {
            adminCentral = adminCentralRepository.findByDni(username);
        }

        if (adminCentral != null) {
            String role = adminCentral.getRolSistema().getNombreRol();
            System.out.println("DEBUG LOGIN: Encontrado como Administrador Central. Rol: " + role);
            return User.builder()
                    .username(adminCentral.getCorreo() != null ? adminCentral.getCorreo() : adminCentral.getDni())
                    .password(adminCentral.getContrasena())
                    .roles(role)
                    .accountLocked("INACTIVO".equalsIgnoreCase(adminCentral.getEstado()))
                    .disabled("INACTIVO".equalsIgnoreCase(adminCentral.getEstado()))
                    .build();
        }

        // 2. Intentar cargar como Administrador de EPS (prioridad por correo, luego por DNI)
        AdminEpsEntity adminEps = adminEpsRepository.findByCorreo(username);
        if (adminEps == null) {
            adminEps = adminEpsRepository.findByDni(username);
        }

        if (adminEps != null) {
            String role = adminEps.getRolSistema().getNombreRol();
            System.out.println("DEBUG LOGIN: Encontrado como Administrador de EPS. Rol: " + role);
            return User.builder()
                    .username(adminEps.getCorreo() != null ? adminEps.getCorreo() : adminEps.getDni())
                    .password(adminEps.getContrasena())
                    .roles(role)
                    .accountLocked("INACTIVO".equalsIgnoreCase(adminEps.getEstado()))
                    .disabled("INACTIVO".equalsIgnoreCase(adminEps.getEstado()))
                    .build();
        }

        // 3. Intentar cargar como Usuario por EPS (solo por DNI)
        UsuarioPorEpsEntity usuarioPorEps = usuarioPorEpsRepository.findByDni(username);
        if (usuarioPorEps != null) {
            String role = usuarioPorEps.getRolSistema().getNombreRol();
            System.out.println("DEBUG LOGIN: Encontrado como Usuario por EPS. Rol: " + role);
            List<String> roles = new ArrayList<>();
            roles.add(role);

            return User.builder()
                    .username(usuarioPorEps.getDni())
                    .password(usuarioPorEps.getContrasena())
                    .roles(roles.toArray(new String[0]))
                    .accountLocked("INACTIVO".equalsIgnoreCase(usuarioPorEps.getEstado()))
                    .disabled("INACTIVO".equalsIgnoreCase(usuarioPorEps.getEstado()))
                    .build();
        }

        System.out.println("DEBUG LOGIN: Usuario " + username + " no encontrado en ninguna tabla.");
        throw new UsernameNotFoundException("Usuario " + username + " no encontrado");
    }

    // Métodos auxiliares para obtener la entidad completa después de la autenticación
    public AdministradorCentralEntity getAdminCentralByUsername(String username) {
        AdministradorCentralEntity adminCentral = adminCentralRepository.findByCorreo(username);
        if (adminCentral == null) {
            adminCentral = adminCentralRepository.findByDni(username);
        }
        return adminCentral;
    }

    public Optional<AdminEpsEntity> getAdminEpsByUsername(String username) { // ✅ CORRECCIÓN: Devuelve Optional
        AdminEpsEntity adminEps = adminEpsRepository.findByCorreo(username);
        if (adminEps == null) {
            adminEps = adminEpsRepository.findByDni(username);
        }
        return Optional.ofNullable(adminEps);
    }

    public UsuarioPorEpsEntity getUsuarioPorEpsByUsername(String username) {
        return usuarioPorEpsRepository.findByDni(username);
    }
}