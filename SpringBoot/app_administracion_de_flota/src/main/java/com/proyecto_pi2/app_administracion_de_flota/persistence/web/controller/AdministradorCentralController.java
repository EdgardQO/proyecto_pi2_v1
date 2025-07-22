package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdministradorCentralEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.AdministradorCentralService;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.RolEpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
@RestController
@RequestMapping("/api/admin-central")
public class AdministradorCentralController {
    private final AdministradorCentralService adminCentralService;

    @Autowired
    public AdministradorCentralController(AdministradorCentralService adminCentralService) {
        this.adminCentralService = adminCentralService;
    }

    @GetMapping
    public ResponseEntity<List<AdministradorCentralEntity>> getAll() {
        return ResponseEntity.ok(this.adminCentralService.getAll());
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<AdministradorCentralEntity> getByCorreo(@PathVariable String correo) {
        return ResponseEntity.ok(this.adminCentralService.getByCorreo(correo));
    }

    @PostMapping
    public ResponseEntity<AdministradorCentralEntity> add(@RequestBody AdministradorCentralEntity adminCentral) {
        if (adminCentral.getIdAdminCentral() == null || !this.adminCentralService.exists(adminCentral.getIdAdminCentral())) {
            return ResponseEntity.ok(this.adminCentralService.save(adminCentral));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    public ResponseEntity<AdministradorCentralEntity> update(@RequestBody AdministradorCentralEntity adminCentral) {
        if (adminCentral.getIdAdminCentral() != null && this.adminCentralService.exists(adminCentral.getIdAdminCentral())) {
            return ResponseEntity.ok(this.adminCentralService.save(adminCentral));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idAdminCentral}")
    public ResponseEntity<Void> delete(@PathVariable Integer idAdminCentral) {
        if (this.adminCentralService.exists(idAdminCentral)) {
            this.adminCentralService.delete(idAdminCentral);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}