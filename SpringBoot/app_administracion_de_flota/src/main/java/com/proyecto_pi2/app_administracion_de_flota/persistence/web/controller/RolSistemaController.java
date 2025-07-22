package com.proyecto_pi2.app_administracion_de_flota.persistence.web.controller;

import com.proyecto_pi2.app_administracion_de_flota.persistence.entity.RolSistemaEntity;
import com.proyecto_pi2.app_administracion_de_flota.persistence.service.RolSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles-sistema")
public class RolSistemaController {

    private final RolSistemaService rolSistemaService;

    @Autowired
    public RolSistemaController(RolSistemaService rolSistemaService) {
        this.rolSistemaService = rolSistemaService;
    }

    @GetMapping
    @Secured({"ROLE_ADMIN_CENTRAL", "ROLE_ADMIN_EPS"}) // Solo estos roles pueden ver los roles de sistema
    public ResponseEntity<List<RolSistemaEntity>> getAllRolesSistema() {
        return ResponseEntity.ok(this.rolSistemaService.getAllRolesSistema());
    }
}