package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.UsuarioPorEpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured; // Importar @Secured
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios-eps")
public class UsuarioPorEpsController {
    private final UsuarioPorEpsService usuarioPorEpsService;

    @Autowired
    public UsuarioPorEpsController(UsuarioPorEpsService usuarioPorEpsService) {
        this.usuarioPorEpsService = usuarioPorEpsService;
    }

    @GetMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"}) // ✅ Sólo Admin Central y Admin EPS pueden ver todos los usuarios o por su EPS.
    public ResponseEntity<List<UsuarioPorEpsEntity>> getAll() {
        return ResponseEntity.ok(this.usuarioPorEpsService.getAll());
    }

    @GetMapping("/dni/{dni}")
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS", "ROLE_USUARIO_EPS"}) // ✅ Usuario EPS también puede ver su propio perfil
    public ResponseEntity<UsuarioPorEpsEntity> getByDni(@PathVariable String dni) {
        // En una aplicación real, si es ROLE_USUARIO_EPS, deberías verificar que el DNI solicitado coincida con su propio DNI.
        return ResponseEntity.ok(this.usuarioPorEpsService.getByDni(dni));
    }

    // ✅ NUEVO ENDPOINT: Obtener usuarios por ID de EPS
    @GetMapping("/by-eps/{idEps}")
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"}) // ✅ Sólo Admin Central y Admin EPS pueden acceder
    public ResponseEntity<List<UsuarioPorEpsEntity>> getUsuariosByEps(@PathVariable Integer idEps) {
        // Para ROLE_ADMIN_EPS, deberías añadir una validación para asegurar que 'idEps'
        // coincida con el 'idEps' del Admin EPS logueado.
        // Ejemplo de validación (idealmente en una capa de servicio):
        /*
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String loggedInUsername = authentication.getName(); // Esto es el correo/DNI
            AdminEpsEntity adminEps = adminEpsService.getAdminEpsByUsername(loggedInUsername); // Asumiendo que tienes un servicio para AdminEps
            if (adminEps != null && !adminEps.getIdEps().equals(idEps)) {
                return ResponseEntity.status(403).build(); // Forbidden si no es su EPS
            }
        }
        */
        List<UsuarioPorEpsEntity> usuarios = usuarioPorEpsService.getUsuariosByEpsId(idEps);
        if (usuarios.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si no hay usuarios
        }
        return ResponseEntity.ok(usuarios);
    }


    @PostMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"}) // ✅ Admin EPS también puede añadir usuarios
    public ResponseEntity<UsuarioPorEpsEntity> add(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        if (usuarioPorEps.getIdUsuarioPorEps() == null || !this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"}) // ✅ Admin EPS también puede actualizar usuarios
    public ResponseEntity<UsuarioPorEpsEntity> update(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        if (usuarioPorEps.getIdUsuarioPorEps() != null && this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idUsuarioPorEps}")
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"}) // ✅ Admin EPS también puede eliminar usuarios
    public ResponseEntity<Void> delete(@PathVariable Integer idUsuarioPorEps) {
        if (this.usuarioPorEpsService.exists(idUsuarioPorEps)) {
            this.usuarioPorEpsService.delete(idUsuarioPorEps);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}