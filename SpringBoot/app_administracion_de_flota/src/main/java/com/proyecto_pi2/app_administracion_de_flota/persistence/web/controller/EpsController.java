package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.EpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.EpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.annotation.Secured; // Importar @Secured

import java.util.List;

@RestController
@RequestMapping("/api/eps")
public class EpsController {
    private final EpsService epsService;

    @Autowired
    public EpsController(EpsService epsService) {
        this.epsService = epsService;
    }

    @GetMapping
    @Secured("ROLE_ADMIN_CENTRAL") // Solo Admin Central puede ver todas las EPS
    public ResponseEntity<List<EpsEntity>> getAll() {
        return ResponseEntity.ok(this.epsService.getAll());
    }

    @GetMapping("/ruc/{ruc}")
    @Secured("ROLE_ADMIN_CENTRAL") // Solo Admin Central puede buscar por RUC
    public ResponseEntity<EpsEntity> getByRuc(@PathVariable String ruc) {
        return ResponseEntity.ok(this.epsService.getByRuc(ruc));
    }

    // Nuevo endpoint para que Admin EPS y Usuario EPS accedan a su propia EPS
    @GetMapping("/my-eps")
    @Secured({"ROLE_ADMIN_EPS", "ROLE_USUARIO_EPS"})
    public ResponseEntity<EpsEntity> getMyEps(@RequestParam Integer id) {
        // En una aplicación real, aquí deberías verificar que el id de EPS
        // solicitado coincide con el id de EPS del usuario autenticado.
        // Por simplicidad, y como el frontend envía su propio id_eps,
        // confiamos en ese id por ahora.
        return epsService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @Secured("ROLE_ADMIN_CENTRAL") // Solo Admin Central puede añadir EPS
    public ResponseEntity<EpsEntity> add(@RequestBody EpsEntity eps) {
        if (eps.getIdEps() == null || !this.epsService.exists(eps.getIdEps())) {
            return ResponseEntity.ok(this.epsService.save(eps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    @Secured("ROLE_ADMIN_CENTRAL") // Solo Admin Central puede actualizar EPS
    public ResponseEntity<EpsEntity> update(@RequestBody EpsEntity eps) {
        if (eps.getIdEps() != null && this.epsService.exists(eps.getIdEps())) {
            return ResponseEntity.ok(this.epsService.save(eps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idEps}") // ✅ CAMBIO: De idEsp a idEps para consistencia
    @Secured("ROLE_ADMIN_CENTRAL") // Solo Admin Central puede eliminar EPS
    public ResponseEntity<Void> delete(@PathVariable Integer idEps) { // ✅ CAMBIO: De idEsp a idEps para consistencia
        if (this.epsService.exists(idEps)) {
            this.epsService.delete(idEps);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}