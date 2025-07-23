package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.EpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.EpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.annotation.Secured;
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
    @Secured("ROLE_ADMIN_CENTRAL")
    public ResponseEntity<List<EpsEntity>> getAll() {
        return ResponseEntity.ok(this.epsService.getAll());
    }

    @GetMapping("/ruc/{ruc}")
    @Secured("ROLE_ADMIN_CENTRAL")
    public ResponseEntity<EpsEntity> getByRuc(@PathVariable String ruc) {
        return ResponseEntity.ok(this.epsService.getByRuc(ruc));
    }

    @GetMapping("/my-eps")
    @Secured({"ROLE_ADMIN_EPS", "ROLE_USUARIO_EPS"})
    public ResponseEntity<EpsEntity> getMyEps(@RequestParam Integer id) {
        return epsService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @Secured("ROLE_ADMIN_CENTRAL")
    public ResponseEntity<EpsEntity> add(@RequestBody EpsEntity eps) {
        if (eps.getIdEps() == null || !this.epsService.exists(eps.getIdEps())) {
            return ResponseEntity.ok(this.epsService.save(eps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    @Secured("ROLE_ADMIN_CENTRAL")
    public ResponseEntity<EpsEntity> update(@RequestBody EpsEntity eps) {
        if (eps.getIdEps() != null && this.epsService.exists(eps.getIdEps())) {
            return ResponseEntity.ok(this.epsService.save(eps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idEps}")
    @Secured("ROLE_ADMIN_CENTRAL")
    public ResponseEntity<Void> delete(@PathVariable Integer idEps) {
        if (this.epsService.exists(idEps)) {
            this.epsService.delete(idEps);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}