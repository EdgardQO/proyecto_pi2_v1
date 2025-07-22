package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.AdminEpsService;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.UsuarioPorEpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // Importar Optional

@RestController
@RequestMapping("/api/usuarios-eps")
public class UsuarioPorEpsController {
    private final UsuarioPorEpsService usuarioPorEpsService;
    private final AdminEpsService adminEpsService;

    @Autowired
    public UsuarioPorEpsController(UsuarioPorEpsService usuarioPorEpsService, AdminEpsService adminEpsService) {
        this.usuarioPorEpsService = usuarioPorEpsService;
        this.adminEpsService = adminEpsService;
    }

    // Método auxiliar para obtener el ID de la EPS del ADMIN_EPS autenticado
    private Integer getAuthenticatedAdminEpsId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName(); // El username es el DNI o correo
            // ✅ CORREGIDO: Usar el método getByDni que ahora devuelve Optional
            Optional<AdminEpsEntity> adminEps = adminEpsService.getByDni(username);
            if (adminEps.isEmpty()) { // Si no lo encuentra por DNI, intentar por correo
                adminEps = Optional.ofNullable(adminEpsService.getByCorreo(username));
            }

            if (adminEps.isPresent()) {
                return adminEps.get().getIdEps();
            }
        }
        return null; // O lanzar una excepción si no se encuentra el ID de la EPS
    }

    @GetMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"})
    public ResponseEntity<List<UsuarioPorEpsEntity>> getAll() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN_CENTRAL"))) {
            return ResponseEntity.ok(this.usuarioPorEpsService.getAll());
        } else if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN_EPS"))) {
            Integer idEps = getAuthenticatedAdminEpsId();
            if (idEps != null) {
                return ResponseEntity.ok(this.usuarioPorEpsService.getUsuariosByEpsId(idEps));
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/dni/{dni}")
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS", "ROLE_USUARIO_EPS"})
    public ResponseEntity<UsuarioPorEpsEntity> getByDni(@PathVariable String dni) {
        // ✅ CORREGIDO: Manejar el Optional devuelto por getByDni
        Optional<UsuarioPorEpsEntity> usuario = this.usuarioPorEpsService.getByDni(dni);
        if (usuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Validación para ADMIN_EPS y USUARIO_EPS: solo pueden ver usuarios de su propia EPS
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer authenticatedEpsId = getAuthenticatedAdminEpsId(); // Esto devuelve null si no es ADMIN_EPS

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN_EPS")) && authenticatedEpsId != null) {
            if (!usuario.get().getIdEps().equals(authenticatedEpsId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USUARIO_EPS"))) {
            // Para USUARIO_EPS, solo puede ver su propio perfil
            if (!authentication.getName().equals(dni)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.ok(usuario.get());
    }

    @GetMapping("/by-eps/{idEps}")
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS", "ROLE_USUARIO_EPS"})
    public ResponseEntity<List<UsuarioPorEpsEntity>> getUsuariosByEps(@PathVariable Integer idEps) {
        // Validación para ADMIN_EPS: solo puede ver usuarios de su propia EPS
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer authenticatedEpsId = getAuthenticatedAdminEpsId();

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN_EPS")) && authenticatedEpsId != null) {
            if (!idEps.equals(authenticatedEpsId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        List<UsuarioPorEpsEntity> usuarios = usuarioPorEpsService.getUsuariosByEpsId(idEps);
        if (usuarios.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"})
    public ResponseEntity<UsuarioPorEpsEntity> add(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        // Validación para ADMIN_EPS: solo puede añadir usuarios a su propia EPS
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN_EPS"))) {
            Integer authenticatedEpsId = getAuthenticatedAdminEpsId();
            if (authenticatedEpsId == null || !usuarioPorEps.getIdEps().equals(authenticatedEpsId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        if (usuarioPorEps.getIdUsuarioPorEps() == null || !this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"})
    public ResponseEntity<UsuarioPorEpsEntity> update(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        // Validación para ADMIN_EPS: solo puede actualizar usuarios de su propia EPS
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN_EPS"))) {
            Integer authenticatedEpsId = getAuthenticatedAdminEpsId();
            if (authenticatedEpsId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            // Asegurarse de que el usuario a actualizar pertenece a la EPS del admin
            // ✅ CORREGIDO: Usar el método getByDni que ahora devuelve Optional
            Optional<UsuarioPorEpsEntity> existingUser = usuarioPorEpsService.getByDni(usuarioPorEps.getDni());
            if (existingUser.isEmpty() || !existingUser.get().getIdEps().equals(authenticatedEpsId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            // Asegurarse de que el ID de EPS en el payload no se cambie a otra EPS
            if (!usuarioPorEps.getIdEps().equals(authenticatedEpsId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        if (usuarioPorEps.getIdUsuarioPorEps() != null && this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idUsuarioPorEps}")
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"})
    public ResponseEntity<Void> delete(@PathVariable Integer idUsuarioPorEps) {
        // Validación para ADMIN_EPS: solo puede eliminar usuarios de su propia EPS
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN_EPS"))) {
            Integer authenticatedEpsId = getAuthenticatedAdminEpsId();
            if (authenticatedEpsId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            // Verificar que el usuario a eliminar pertenece a la EPS del admin
            // ✅ CORREGIDO: Usar el método getById que devuelve Optional
            Optional<UsuarioPorEpsEntity> userToDelete = usuarioPorEpsService.getById(idUsuarioPorEps);
            if (userToDelete.isEmpty() || !userToDelete.get().getIdEps().equals(authenticatedEpsId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        if (this.usuarioPorEpsService.exists(idUsuarioPorEps)) {
            this.usuarioPorEpsService.delete(idUsuarioPorEps);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}