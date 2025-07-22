package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.UsuarioPorEpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
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
    // ✅ CAMBIO CRÍTICO: "ROLE_ADMIN_EPS" a "ADMIN_EPS"
    @Secured({"ROLE_ADMIN_CENTRAL", "ADMIN_EPS"})
    public ResponseEntity<List<UsuarioPorEpsEntity>> getAll() {
        return ResponseEntity.ok(this.usuarioPorEpsService.getAll());
    }

    @GetMapping("/dni/{dni}")
    // ✅ CAMBIO CRÍTICO: "ROLE_USUARIO_EPS" a "USUARIO_EPS"
    @Secured({"ROLE_ADMIN_CENTRAL", "ADMIN_EPS", "USUARIO_EPS"})
    public ResponseEntity<UsuarioPorEpsEntity> getByDni(@PathVariable String dni) {
        return ResponseEntity.ok(this.usuarioPorEpsService.getByDni(dni));
    }

    @GetMapping("/by-eps/{idEps}")
    // ✅ CAMBIO CRÍTICO: "ROLE_ADMIN_EPS" a "ADMIN_EPS"
    @Secured({"ROLE_ADMIN_CENTRAL", "ADMIN_EPS"})
    public ResponseEntity<List<UsuarioPorEpsEntity>> getUsuariosByEps(@PathVariable Integer idEps) {
        List<UsuarioPorEpsEntity> usuarios = usuarioPorEpsService.getUsuariosByEpsId(idEps);
        if (usuarios.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping
    // ✅ CAMBIO CRÍTICO: "ROLE_ADMIN_EPS" a "ADMIN_EPS"
    @Secured({"ROLE_ADMIN_CENTRAL", "ADMIN_EPS"})
    public ResponseEntity<UsuarioPorEpsEntity> add(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        if (usuarioPorEps.getIdUsuarioPorEps() == null || !this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    // ✅ CAMBIO CRÍTICO: "ROLE_ADMIN_EPS" a "ADMIN_EPS"
    @Secured({"ROLE_ADMIN_CENTRAL", "ADMIN_EPS"})
    public ResponseEntity<UsuarioPorEpsEntity> update(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        if (usuarioPorEps.getIdUsuarioPorEps() != null && this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idUsuarioPorEps}")
    // ✅ CAMBIO CRÍTICO: "ROLE_ADMIN_EPS" a "ADMIN_EPS"
    @Secured({"ROLE_ADMIN_CENTRAL", "ADMIN_EPS"})
    public ResponseEntity<Void> delete(@PathVariable Integer idUsuarioPorEps) {
        if (this.usuarioPorEpsService.exists(idUsuarioPorEps)) {
            this.usuarioPorEpsService.delete(idUsuarioPorEps);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}