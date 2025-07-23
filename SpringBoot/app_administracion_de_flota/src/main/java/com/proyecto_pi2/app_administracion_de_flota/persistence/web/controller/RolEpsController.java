package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.RolEpsEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.RolEpsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles-eps")
public class RolEpsController {

    private final RolEpsService rolEpsService;

    @Autowired
    public RolEpsController(RolEpsService rolEpsService) {
        this.rolEpsService = rolEpsService;
    }

    @GetMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"})
    public ResponseEntity<List<RolEpsEntity>> getAllRolesEps() {
        return ResponseEntity.ok(this.rolEpsService.getAllRolesEps());
    }
}