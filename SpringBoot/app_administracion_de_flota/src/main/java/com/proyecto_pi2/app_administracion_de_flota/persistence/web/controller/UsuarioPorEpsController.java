package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.UsuarioPorEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.UsuarioPorEpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<UsuarioPorEpsEntity>> getAll() {
        return ResponseEntity.ok(this.usuarioPorEpsService.getAll());
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<UsuarioPorEpsEntity> getByDni(@PathVariable String dni) {
        return ResponseEntity.ok(this.usuarioPorEpsService.getByDni(dni));
    }

    @PostMapping
    public ResponseEntity<UsuarioPorEpsEntity> add(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        if (usuarioPorEps.getIdUsuarioPorEps() == null || !this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    public ResponseEntity<UsuarioPorEpsEntity> update(@RequestBody UsuarioPorEpsEntity usuarioPorEps) {
        if (usuarioPorEps.getIdUsuarioPorEps() != null && this.usuarioPorEpsService.exists(usuarioPorEps.getIdUsuarioPorEps())) {
            return ResponseEntity.ok(this.usuarioPorEpsService.save(usuarioPorEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idUsuarioPorEps}")
    public ResponseEntity<Void> delete(@PathVariable Integer idUsuarioPorEps) {
        if (this.usuarioPorEpsService.exists(idUsuarioPorEps)) {
            this.usuarioPorEpsService.delete(idUsuarioPorEps);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}