package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.EpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.EpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<EpsEntity>> getAll() {
        return ResponseEntity.ok(this.epsService.getAll());
    }

    @GetMapping("/ruc/{ruc}")
    public ResponseEntity<EpsEntity> getByRuc(@PathVariable String ruc) {
        return ResponseEntity.ok(this.epsService.getByRuc(ruc));
    }

    @PostMapping
    public ResponseEntity<EpsEntity> add(@RequestBody EpsEntity eps) {
        if (eps.getIdEsp() == null || !this.epsService.exists(eps.getIdEsp())) {
            return ResponseEntity.ok(this.epsService.save(eps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    public ResponseEntity<EpsEntity> update(@RequestBody EpsEntity eps) {
        if (eps.getIdEsp() != null && this.epsService.exists(eps.getIdEsp())) {
            return ResponseEntity.ok(this.epsService.save(eps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idEsp}")
    public ResponseEntity<Void> delete(@PathVariable Integer idEsp) {
        if (this.epsService.exists(idEsp)) {
            this.epsService.delete(idEsp);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}