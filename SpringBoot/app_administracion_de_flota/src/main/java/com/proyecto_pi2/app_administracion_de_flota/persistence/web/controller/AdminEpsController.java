package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.AdminEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.AdminEpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin-eps")
public class AdminEpsController {
    private final AdminEpsService adminEpsService;

    @Autowired
    public AdminEpsController(AdminEpsService adminEpsService) {
        this.adminEpsService = adminEpsService;
    }

    @GetMapping
    public ResponseEntity<List<AdminEpsEntity>> getAll() {
        return ResponseEntity.ok(this.adminEpsService.getAll());
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<AdminEpsEntity> getByCorreo(@PathVariable String correo) {
        return ResponseEntity.ok(this.adminEpsService.getByCorreo(correo));
    }

    @PostMapping
    public ResponseEntity<AdminEpsEntity> add(@RequestBody AdminEpsEntity adminEps) {
        if (adminEps.getIdAdminEps() == null || !this.adminEpsService.exists(adminEps.getIdAdminEps())) {
            return ResponseEntity.ok(this.adminEpsService.save(adminEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping
    public ResponseEntity<AdminEpsEntity> update(@RequestBody AdminEpsEntity adminEps) {
        if (adminEps.getIdAdminEps() != null && this.adminEpsService.exists(adminEps.getIdAdminEps())) {
            return ResponseEntity.ok(this.adminEpsService.save(adminEps));
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{idAdminEps}")
    public ResponseEntity<Void> delete(@PathVariable Integer idAdminEps) {
        if (this.adminEpsService.exists(idAdminEps)) {
            this.adminEpsService.delete(idAdminEps);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
